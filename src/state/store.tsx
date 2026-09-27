import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { WORLDS, getWorld } from "@/data/worlds";
import type { RoomFeature, TimeOfDay, WeatherKind } from "@/data/types";
import { loadState, saveState, clearState } from "@/lib/storage";
import { hoursOf, todayKey } from "@/lib/format";

export interface Task {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  done: boolean;
  createdAt: number;
}

export interface Note {
  id: string;
  body: string;
  worldId: string;
  createdAt: number;
}

export interface SessionRecord {
  id: string;
  worldId: string;
  seconds: number;
  endedAt: number;
}

export interface Progress {
  totalSeconds: number;
  todaySeconds: number;
  todayDate: string;
  longestSeconds: number;
  sessions: SessionRecord[];
  worldSeconds: Record<string, number>;
}

export interface Settings {
  reducedMotion: boolean;
  cameraEnabled: boolean;
  muted: boolean;
  masterVolume: number;
  ambientVolume: number;
  /** the single testing switch — bypasses every world/atmosphere gate */
  devMode: boolean;
  /** last custom session length the user entered */
  focusMinutes: number;
}

export interface WorldAtmosphere {
  time: TimeOfDay;
  weather: WeatherKind;
  features: Record<RoomFeature, boolean>;
}

const defaultProgress: Progress = {
  totalSeconds: 0,
  todaySeconds: 0,
  todayDate: todayKey(),
  longestSeconds: 0,
  sessions: [],
  worldSeconds: {},
};

const defaultSettings: Settings = {
  reducedMotion: false,
  cameraEnabled: true,
  muted: false,
  masterVolume: 0.6,
  ambientVolume: 0.7,
  devMode: false,
  focusMinutes: 25,
};

/** worlds a normal user has earned, derived from total focus time */
function earnedWorlds(totalSeconds: number): string[] {
  return WORLDS.filter((w) => hoursOf(totalSeconds) >= w.unlockHours).map((w) => w.id);
}

function mergeUnlocked(current: string[], extra: string[]): string[] {
  const next = new Set(current);
  for (const id of extra) next.add(id);
  return next.size === current.length ? current : Array.from(next);
}

function defaultAtmosphere(worldId: string): WorldAtmosphere {
  const world = getWorld(worldId);
  const seedTime: Record<string, TimeOfDay> = {
    "japanese-room": "morning",
    "fantasy-library": "golden",
    "cozy-cafe": "afternoon",
    "cozy-bedroom": "night",
    "snow-cabin": "sunset",
    observatory: "midnight",
    treehouse: "morning",
    "blossom-pavilion": "sunrise",
  };
  const seedWeather: Record<string, WeatherKind> = {
    "japanese-room": "clear",
    "fantasy-library": "rain",
    "cozy-cafe": "rain",
    "cozy-bedroom": "cloudy",
    "snow-cabin": "snow",
    observatory: "clear",
    treehouse: "windy",
    "blossom-pavilion": "clear",
  };
  const features = { fireplace: false, candles: false, deskLamp: false, window: true } as Record<
    RoomFeature,
    boolean
  >;
  // hearth worlds greet you with the fire already lit
  const fireLit = worldId === "fantasy-library" || worldId === "snow-cabin";
  for (const f of world.roomFeatures) features[f] = f === "fireplace" ? fireLit : true;
  return {
    time: seedTime[worldId] ?? "afternoon",
    weather: world.supportedWeather.includes(seedWeather[worldId] ?? "clear")
      ? (seedWeather[worldId] ?? "clear")
      : (world.supportedWeather[0] ?? "clear"),
    features,
  };
}

interface StoreValue {
  hydrated: boolean;
  progress: Progress;
  settings: Settings;
  /** world ids permanently unlocked for this user (persisted) */
  unlockedWorlds: string[];
  tasks: Task[];
  notes: Note[];
  selectedWorldId: string;
  atmosphere: WorldAtmosphere;
  atmosphereFor: (worldId: string) => WorldAtmosphere;
  selectWorld: (id: string) => void;
  setTime: (t: TimeOfDay) => void;
  setWeather: (w: WeatherKind) => void;
  toggleFeature: (f: RoomFeature) => void;
  setFeature: (f: RoomFeature, on: boolean) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addTask: (title: string, priority: Task["priority"]) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addNote: (body: string) => void;
  deleteNote: (id: string) => void;
  recordSession: (worldId: string, seconds: number) => void;
  addFocusSeconds: (seconds: number) => void;
  resetProgress: () => void;
  isUnlocked: (worldId: string) => boolean;
  unlockProgress: (worldId: string) => { hours: number; required: number; ratio: number };
}

const StoreContext = createContext<StoreValue | null>(null);

export function StudyScapeProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [unlockedWorlds, setUnlockedWorlds] = useState<string[]>(() => earnedWorlds(0));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedWorldId, setSelectedWorldId] = useState<string>(WORLDS[0]!.id);
  const [atmoMap, setAtmoMap] = useState<Record<string, WorldAtmosphere>>({});

  // hydrate on the client only — SSR renders the deterministic defaults
  useEffect(() => {
    const p = loadState<Progress>("progress", defaultProgress);
    const today = todayKey();
    setProgress(p.todayDate === today ? p : { ...p, todaySeconds: 0, todayDate: today });
    // older saves used a separate `devUnlockAll` flag — fold it into devMode
    const { devUnlockAll, ...savedSettings } = loadState<Settings & { devUnlockAll?: boolean }>(
      "settings",
      defaultSettings,
    );
    setSettings({ ...savedSettings, devMode: savedSettings.devMode || devUnlockAll === true });
    // earned access is kept forever; older saves without the key are rebuilt from progress
    const saved = loadState<unknown>("unlockedWorlds", []);
    const known = Array.isArray(saved)
      ? saved.filter((id): id is string => typeof id === "string" && WORLDS.some((w) => w.id === id))
      : [];
    setUnlockedWorlds(mergeUnlocked(known, earnedWorlds(p.totalSeconds)));
    setTasks(loadState<Task[]>("tasks", []));
    setNotes(loadState<Note[]>("notes", []));
    setSelectedWorldId(loadState<string>("selectedWorld", WORLDS[0]!.id));
    setAtmoMap(loadState<Record<string, WorldAtmosphere>>("atmosphere", {}));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState("progress", progress);
  }, [hydrated, progress]);
  useEffect(() => {
    if (hydrated) saveState("settings", settings);
  }, [hydrated, settings]);
  useEffect(() => {
    if (hydrated) saveState("unlockedWorlds", unlockedWorlds);
  }, [hydrated, unlockedWorlds]);
  // reaching a threshold unlocks a world permanently — later sessions never remove it
  useEffect(() => {
    if (hydrated) setUnlockedWorlds((u) => mergeUnlocked(u, earnedWorlds(progress.totalSeconds)));
  }, [hydrated, progress.totalSeconds]);
  useEffect(() => {
    if (hydrated) saveState("tasks", tasks);
  }, [hydrated, tasks]);
  useEffect(() => {
    if (hydrated) saveState("notes", notes);
  }, [hydrated, notes]);
  useEffect(() => {
    if (hydrated) saveState("selectedWorld", selectedWorldId);
  }, [hydrated, selectedWorldId]);
  useEffect(() => {
    if (hydrated) saveState("atmosphere", atmoMap);
  }, [hydrated, atmoMap]);

  const atmosphereFor = useCallback(
    (worldId: string) => atmoMap[worldId] ?? defaultAtmosphere(worldId),
    [atmoMap],
  );

  const atmosphere = atmosphereFor(selectedWorldId);

  const patchAtmosphere = useCallback(
    (patch: Partial<WorldAtmosphere>) => {
      setAtmoMap((prev) => {
        const current = prev[selectedWorldId] ?? defaultAtmosphere(selectedWorldId);
        return { ...prev, [selectedWorldId]: { ...current, ...patch } };
      });
    },
    [selectedWorldId],
  );

  // the one access rule every card, guard and panel goes through
  const isUnlocked = useCallback(
    (worldId: string) => {
      if (settings.devMode) return true;
      if (unlockedWorlds.includes(worldId)) return true;
      return hoursOf(progress.totalSeconds) >= getWorld(worldId).unlockHours;
    },
    [progress.totalSeconds, settings.devMode, unlockedWorlds],
  );

  const value: StoreValue = useMemo(
    () => ({
      hydrated,
      progress,
      settings,
      unlockedWorlds,
      tasks,
      notes,
      selectedWorldId,
      atmosphere,
      atmosphereFor,
      selectWorld: (id) => setSelectedWorldId(id),
      setTime: (time) => patchAtmosphere({ time }),
      setWeather: (weather) => patchAtmosphere({ weather }),
      setFeature: (f, on) =>
        patchAtmosphere({ features: { ...atmosphere.features, [f]: on } }),
      toggleFeature: (f) =>
        patchAtmosphere({ features: { ...atmosphere.features, [f]: !atmosphere.features[f] } }),
      updateSettings: (patch) => setSettings((s) => ({ ...s, ...patch })),
      addTask: (title, priority) =>
        setTasks((t) => [
          { id: crypto.randomUUID(), title, priority, done: false, createdAt: Date.now() },
          ...t,
        ]),
      toggleTask: (id) =>
        setTasks((t) => t.map((task) => (task.id === id ? { ...task, done: !task.done } : task))),
      deleteTask: (id) => setTasks((t) => t.filter((task) => task.id !== id)),
      addNote: (body) =>
        setNotes((n) => [
          { id: crypto.randomUUID(), body, worldId: selectedWorldId, createdAt: Date.now() },
          ...n,
        ]),
      deleteNote: (id) => setNotes((n) => n.filter((note) => note.id !== id)),
      addFocusSeconds: (seconds) =>
        setProgress((p) => {
          const today = todayKey();
          const rolled = p.todayDate === today ? p : { ...p, todaySeconds: 0, todayDate: today };
          return {
            ...rolled,
            totalSeconds: rolled.totalSeconds + seconds,
            todaySeconds: rolled.todaySeconds + seconds,
          };
        }),
      recordSession: (worldId, seconds) =>
        setProgress((p) => {
          const today = todayKey();
          const rolled = p.todayDate === today ? p : { ...p, todaySeconds: 0, todayDate: today };
          return {
            ...rolled,
            longestSeconds: Math.max(rolled.longestSeconds, seconds),
            sessions: [
              { id: crypto.randomUUID(), worldId, seconds, endedAt: Date.now() },
              ...rolled.sessions,
            ].slice(0, 200),
            worldSeconds: {
              ...rolled.worldSeconds,
              [worldId]: (rolled.worldSeconds[worldId] ?? 0) + seconds,
            },
          };
        }),
      // developer reset: progression and earned access return to a fresh profile together
      resetProgress: () => {
        setProgress({ ...defaultProgress, todayDate: todayKey() });
        setUnlockedWorlds(earnedWorlds(0));
        clearState("progress");
      },
      isUnlocked,
      unlockProgress: (worldId) => {
        const world = getWorld(worldId);
        const hours = hoursOf(progress.totalSeconds);
        const required = world.unlockHours;
        return {
          hours,
          required,
          ratio: required === 0 || unlockedWorlds.includes(worldId) ? 1 : Math.min(1, hours / required),
        };
      },
    }),
    [
      hydrated,
      progress,
      settings,
      unlockedWorlds,
      tasks,
      notes,
      selectedWorldId,
      atmosphere,
      atmosphereFor,
      patchAtmosphere,
      isUnlocked,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStudyScape(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStudyScape must be used inside StudyScapeProvider");
  return ctx;
}
