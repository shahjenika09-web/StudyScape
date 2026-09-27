import { ActionButton, OptionChip, PanelHeader, SectionLabel, ToggleRow } from "@/components/ui/primitives";
import { AVATAR_ANIMATIONS, type AvatarState } from "@/data/animations";
import { TIMES_OF_DAY } from "@/data/timeOfDay";
import { WEATHER_ORDER, WEATHER_PRESETS } from "@/data/weather";
import { WORLDS } from "@/data/worlds";
import type { WorldConfig } from "@/data/types";
import { CAMERA_SHOTS, type CameraShot } from "@/hooks/useCamera";
import { formatDuration } from "@/lib/format";
import { useStudyScape } from "@/state/store";

interface Props {
  world: WorldConfig;
  onClose?: () => void;
  forcedAvatar: AvatarState | null;
  setForcedAvatar: (s: AvatarState | null) => void;
  forcedShot: CameraShot | null;
  setForcedShot: (s: CameraShot | null) => void;
}

export function DeveloperPanel({
  world,
  onClose,
  forcedAvatar,
  setForcedAvatar,
  forcedShot,
  setForcedShot,
}: Props) {
  const {
    settings,
    updateSettings,
    progress,
    addFocusSeconds,
    resetProgress,
    selectWorld,
    selectedWorldId,
    atmosphere,
    setTime,
    setWeather,
    setFeature,
  } = useStudyScape();

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Developer" subtitle="Testing tools — outside the normal flow" {...(onClose ? { onClose } : {})} />

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <ToggleRow
          label="DEV MODE"
          description="All worlds and weather open; earned progress is untouched"
          checked={settings.devMode}
          onChange={(v) => updateSettings({ devMode: v })}
        />

        <section>
          <SectionLabel>Enter any world</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {WORLDS.map((w) => (
              <OptionChip key={w.id} active={selectedWorldId === w.id} onClick={() => selectWorld(w.id)}>
                {w.name}
              </OptionChip>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>Focus time</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {[0.5, 1, 5, 10, 25].map((h) => (
              <OptionChip key={h} onClick={() => addFocusSeconds(h * 3600)}>
                +{h}h
              </OptionChip>
            ))}
            <ActionButton variant="danger" onClick={resetProgress}>
              Reset progression
            </ActionButton>
          </div>
        </section>

        <section>
          <SectionLabel>Weather (all, including unsupported)</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {WEATHER_ORDER.map((w) => (
              <OptionChip key={w} active={atmosphere.weather === w} onClick={() => setWeather(w)}>
                {WEATHER_PRESETS[w].label}
              </OptionChip>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>Time of day</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {TIMES_OF_DAY.map((t) => (
              <OptionChip key={t.id} active={atmosphere.time === t.id} onClick={() => setTime(t.id)}>
                {t.label}
              </OptionChip>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>Room features</SectionLabel>
          <div className="space-y-2">
            {world.roomFeatures.map((f) => (
              <ToggleRow
                key={f}
                label={f}
                checked={atmosphere.features[f]}
                onChange={(v) => setFeature(f, v)}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>Avatar animation</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            <OptionChip active={forcedAvatar === null} onClick={() => setForcedAvatar(null)}>
              Auto
            </OptionChip>
            {Object.values(AVATAR_ANIMATIONS).map((a) => (
              <OptionChip key={a.id} active={forcedAvatar === a.id} onClick={() => setForcedAvatar(a.id)}>
                {a.label}
              </OptionChip>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>Camera shot</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            <OptionChip active={forcedShot === null} onClick={() => setForcedShot(null)}>
              Auto
            </OptionChip>
            {(Object.keys(CAMERA_SHOTS) as CameraShot[]).map((s) => (
              <OptionChip key={s} active={forcedShot === s} onClick={() => setForcedShot(s)}>
                {CAMERA_SHOTS[s].label}
              </OptionChip>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>Debug</SectionLabel>
          <dl className="space-y-1 rounded-2xl border border-[var(--hairline)] bg-black/25 p-3 font-mono text-[11px] text-muted-foreground">
            <div className="flex justify-between"><dt>world</dt><dd className="text-foreground/80">{world.id}</dd></div>
            <div className="flex justify-between"><dt>windows</dt><dd className="text-foreground/80">{world.windows.length}</dd></div>
            <div className="flex justify-between"><dt>weather</dt><dd className="text-foreground/80">{atmosphere.weather}</dd></div>
            <div className="flex justify-between"><dt>time</dt><dd className="text-foreground/80">{atmosphere.time}</dd></div>
            <div className="flex justify-between"><dt>total</dt><dd className="text-foreground/80">{formatDuration(progress.totalSeconds)}</dd></div>
            <div className="flex justify-between"><dt>sessions</dt><dd className="text-foreground/80">{progress.sessions.length}</dd></div>
            <div className="flex justify-between"><dt>reducedMotion</dt><dd className="text-foreground/80">{String(settings.reducedMotion)}</dd></div>
          </dl>
        </section>
      </div>
    </div>
  );
}
