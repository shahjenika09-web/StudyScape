import { ActionButton, PanelHeader, SectionLabel, Slider, ToggleRow } from "@/components/ui/primitives";
import { WEATHER_PRESETS } from "@/data/weather";
import type { WorldConfig } from "@/data/types";
import { describeLayers, layersFor } from "@/lib/audio";
import { useStudyScape } from "@/state/store";

export function AudioPanel({
  world,
  onClose,
  audioReady,
  onEnableAudio,
}: {
  world: WorldConfig;
  onClose?: () => void;
  audioReady: boolean;
  onEnableAudio: () => void;
}) {
  const { settings, updateSettings, atmosphere } = useStudyScape();

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Ambience" subtitle="Sound that matches the room" {...(onClose ? { onClose } : {})} />

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
        {!audioReady && (
          <div className="rounded-2xl border border-[var(--hairline)] bg-white/[0.03] p-4">
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              Sound is generated live in the browser. Browsers need one tap before audio can start.
            </p>
            <ActionButton className="mt-3 w-full" onClick={onEnableAudio}>
              Turn on ambience
            </ActionButton>
          </div>
        )}

        <section className="space-y-4">
          <SectionLabel>Levels</SectionLabel>
          <Slider
            label="Master volume"
            value={settings.masterVolume}
            onChange={(v) => updateSettings({ masterVolume: v })}
          />
          <Slider
            label="Ambient layers"
            value={settings.ambientVolume}
            onChange={(v) => updateSettings({ ambientVolume: v })}
          />
          <ToggleRow
            label="Mute"
            description="Silence everything without losing your levels"
            checked={settings.muted}
            onChange={(v) => updateSettings({ muted: v })}
          />
        </section>

        <section>
          <SectionLabel>Playing in this world</SectionLabel>
          <ul className="space-y-1.5 text-[12px] text-muted-foreground">
            {describeLayers(
              layersFor(world.id, atmosphere.weather, atmosphere.time, atmosphere.features.fireplace),
            ).map((a) => (
              <li key={a} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[var(--primary)]" />
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Changes with the weather and time of day — {WEATHER_PRESETS[atmosphere.weather].ambience.toLowerCase()} right now.
          </p>
        </section>
      </div>
    </div>
  );
}
