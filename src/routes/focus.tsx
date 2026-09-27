import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { AtmospherePanel } from "@/components/atmosphere/AtmospherePanel";
import { AudioPanel } from "@/components/audio/AudioPanel";
import { DeveloperPanel } from "@/components/developer/DeveloperPanel";
import { FocusHud, type PanelKey } from "@/components/focus/FocusHud";
import { SessionComplete } from "@/components/focus/SessionComplete";
import { SidePanel } from "@/components/focus/SidePanel";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { StatsPanel } from "@/components/stats/StatsPanel";
import { TasksPanel } from "@/components/tasks/TasksPanel";
import { PanelHeader } from "@/components/ui/primitives";
import { WorldCard } from "@/components/worlds/WorldCard";
import { WorldScene } from "@/components/worlds/WorldScene";
import type { AvatarState } from "@/data/animations";
import { WORLDS, getWorld } from "@/data/worlds";
import { useAvatar } from "@/hooks/useAvatar";
import { useCamera, type CameraShot } from "@/hooks/useCamera";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { usePageVisible, useReducedMotion } from "@/hooks/useReducedMotion";
import { AmbienceEngine, layersFor } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { parseSessionLength } from "@/lib/format";
import { useStudyScape } from "@/state/store";

export const Route = createFileRoute("/focus")({
  head: () => ({
    meta: [
      { title: "Focus Session — StudyScape" },
      {
        name: "description",
        content:
          "Step inside your study world, start the timer and let the weather happen outside the window while you focus.",
      },
      { property: "og:title", content: "Focus Session — StudyScape" },
      { property: "og:description", content: "An immersive focus session inside a living study world." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FocusPage,
});

function FocusPage() {
  const navigate = useNavigate();
  const {
    hydrated,
    selectedWorldId,
    selectWorld,
    atmosphere,
    settings,
    updateSettings,
    recordSession,
    addFocusSeconds,
    isUnlocked,
  } = useStudyScape();

  const world = getWorld(selectedWorldId);
  const reducedMotion = useReducedMotion();
  const visible = usePageVisible();

  const [panel, setPanel] = useState<PanelKey | null>(null);
  // raw text so invalid input can be explained instead of silently coerced
  const [hoursInput, setHoursInput] = useState("0");
  const [minutesInput, setMinutesInput] = useState("25");
  const [touched, setTouched] = useState(false);
  const length = parseSessionLength(hoursInput, minutesInput);
  const minutes = length.ok ? length.minutes : settings.focusMinutes;
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState<number | null>(null);
  const [forcedAvatar, setForcedAvatar] = useState<AvatarState | null>(null);
  const [forcedShot, setForcedShot] = useState<CameraShot | null>(null);
  const [audioReady, setAudioReady] = useState(false);

  const finish = useCallback(
    (seconds: number) => {
      if (seconds > 0) {
        addFocusSeconds(seconds);
        recordSession(world.id, seconds);
      }
      setCompleted(seconds);
      setStarted(false);
    },
    [addFocusSeconds, recordSession, world.id],
  );

  const timer = useFocusTimer(minutes, finish);

  // prefill the inputs with the last length this user chose, once saved settings load
  const seededRef = useRef(false);
  useEffect(() => {
    if (!hydrated || seededRef.current) return;
    seededRef.current = true;
    setHoursInput(String(Math.floor(settings.focusMinutes / 60)));
    setMinutesInput(String(settings.focusMinutes % 60));
  }, [hydrated, settings.focusMinutes]);

  // ambience engine — real synthesised sound, started on an explicit gesture
  const engineRef = useRef<AmbienceEngine | null>(null);
  useEffect(() => {
    engineRef.current = new AmbienceEngine();
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !audioReady) return;
    engine.setMasterVolume(settings.muted ? 0 : settings.masterVolume);
    engine.setLayers(
      started && visible
        ? layersFor(world.id, atmosphere.weather, atmosphere.time, atmosphere.features.fireplace)
        : [],
      settings.ambientVolume,
    );
  }, [
    audioReady,
    settings.muted,
    settings.masterVolume,
    settings.ambientVolume,
    world.id,
    atmosphere.weather,
    atmosphere.time,
    atmosphere.features.fireplace,
    started,
    visible,
  ]);

  const enableAudio = async () => {
    try {
      await engineRef.current?.ensure();
      setAudioReady(true);
    } catch {
      /* autoplay refused — the Ambience panel keeps its manual "Turn on" button */
    }
  };

  const { animation, state } = useAvatar({
    active: started,
    onBreak: timer.status === "paused",
    reducedMotion,
    forced: forcedAvatar,
    canSip: world.avatar.items.some((i) => i === "coffee" || i === "tea" || i === "cocoa" || i === "mug"),
  });

  const { frame, shot } = useCamera({
    enabled: settings.cameraEnabled && started,
    reducedMotion,
    forced: forcedShot,
  });

  // a locked world can never be entered
  useEffect(() => {
    if (hydrated && !isUnlocked(world.id)) {
      const fallback = WORLDS.find((w) => isUnlocked(w.id));
      if (fallback) selectWorld(fallback.id);
    }
  }, [hydrated, isUnlocked, selectWorld, world.id]);

  const begin = () => {
    if (!length.ok) {
      setTouched(true);
      return;
    }
    // this click is the user gesture browsers require before audio may start
    void enableAudio();
    updateSettings({ focusMinutes: length.minutes });
    setCompleted(null);
    setStarted(true);
    timer.start(length.minutes);
  };

  const end = () => {
    const seconds = timer.end();
    finish(seconds);
  };

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[var(--plum-deep)]">
      <WorldScene
        className="absolute inset-0 overflow-hidden"
        world={world}
        time={atmosphere.time}
        weather={atmosphere.weather}
        features={atmosphere.features}
        reducedMotion={reducedMotion}
        paused={!visible}
        camera={started ? frame : undefined}
        animation={animation}
        showAvatar={started}
      />

      {!started && completed === null && (
        <div className="absolute inset-0 z-30 grid place-items-center px-4">
          <div className="glass-panel animate-rise w-full max-w-md rounded-[28px] px-6 py-7 text-center sm:px-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{world.name}</p>
            <h1 className="mt-2 font-display text-[28px] leading-tight text-foreground">{world.tagline}</h1>

            <form
              className="mt-6"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                begin();
              }}
            >
              <p id="session-length-label" className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Session length
              </p>
              <div className="flex items-center justify-center gap-2" role="group" aria-labelledby="session-length-label">
                {(
                  [
                    { id: "session-hours", unit: "h", label: "Hours", value: hoursInput, set: setHoursInput },
                    { id: "session-minutes", unit: "m", label: "Minutes", value: minutesInput, set: setMinutesInput },
                  ] as const
                ).map((f) => (
                  <label
                    key={f.id}
                    htmlFor={f.id}
                    className={cn(
                      "flex items-baseline gap-1 rounded-full border bg-white/[0.03] px-4 py-2 transition focus-within:border-[color-mix(in_oklab,var(--primary)_55%,transparent)] focus-within:bg-[color-mix(in_oklab,var(--primary)_10%,transparent)]",
                      touched && !length.ok
                        ? "border-[color-mix(in_oklab,var(--destructive)_55%,transparent)]"
                        : "border-[var(--hairline)]",
                    )}
                  >
                    <input
                      id={f.id}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      aria-label={f.label}
                      aria-invalid={touched && !length.ok}
                      aria-describedby="session-length-error"
                      value={f.value}
                      onChange={(e) => {
                        f.set(e.target.value);
                        setTouched(true);
                      }}
                      onFocus={(e) => e.target.select()}
                      className="w-9 bg-transparent text-right font-display text-[22px] tabular-nums text-foreground outline-none"
                    />
                    <span className="text-[12px] text-muted-foreground">{f.unit}</span>
                  </label>
                ))}
              </div>
              <p
                id="session-length-error"
                role="alert"
                className="mt-2 min-h-[16px] text-[11px] text-[color-mix(in_oklab,var(--destructive)_80%,white)]"
              >
                {touched && !length.ok ? length.error : ""}
              </p>

              <button
                type="submit"
                disabled={!length.ok}
                className="mt-4 w-full rounded-full bg-[image:var(--gradient-ember)] px-6 py-3.5 text-[14px] font-semibold text-[oklch(0.2_0.03_40)] shadow-[0_14px_36px_-16px_color-mix(in_oklab,var(--ember)_85%,transparent)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:brightness-100"
              >
                Enter the room
              </button>
            </form>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="mt-3 text-[12px] text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
            >
              Back home
            </button>
          </div>
        </div>
      )}
      {started && (
        <FocusHud
          timer={timer}
          worldName={world.name}
          avatarLabel={animation.label}
          cameraLabel={frame.label}
          activePanel={panel}
          onPanel={setPanel}
          onEnd={end}
          onExit={() => navigate({ to: "/" })}
          devMode={settings.devMode}
        />
      )}

      <SidePanel open={panel !== null} onClose={() => setPanel(null)}>
        {panel === "atmosphere" && <AtmospherePanel world={world} onClose={() => setPanel(null)} />}
        {panel === "tasks" && <TasksPanel onClose={() => setPanel(null)} />}
        {panel === "notes" && <NotesPanel onClose={() => setPanel(null)} />}
        {panel === "stats" && <StatsPanel onClose={() => setPanel(null)} />}
        {panel === "audio" && (
          <AudioPanel
            world={world}
            onClose={() => setPanel(null)}
            audioReady={audioReady}
            onEnableAudio={() => void enableAudio()}
          />
        )}
        {panel === "worlds" && (
          <div className="flex h-full flex-col">
            <PanelHeader title="Worlds" subtitle="Move to another place" onClose={() => setPanel(null)} />
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-5">
              {WORLDS.map((w) => (
                <WorldCard
                  key={w.id}
                  world={w}
                  compact
                  active={w.id === world.id}
                  onSelect={(id) => selectWorld(id)}
                />
              ))}
            </div>
          </div>
        )}
        {panel === "developer" && (
          <DeveloperPanel
            world={world}
            onClose={() => setPanel(null)}
            forcedAvatar={forcedAvatar}
            setForcedAvatar={setForcedAvatar}
            forcedShot={forcedShot}
            setForcedShot={setForcedShot}
          />
        )}
      </SidePanel>

      {completed !== null && (
        <SessionComplete
          seconds={completed}
          worldName={world.name}
          onAgain={() => {
            setCompleted(null);
            begin();
          }}
          onHome={() => navigate({ to: "/" })}
        />
      )}

      <span className="sr-only" aria-live="polite">
        {started ? `${animation.label}, ${shot} shot` : ""}
      </span>
    </main>
  );
}
