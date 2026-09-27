import { TIMES_OF_DAY } from "@/data/timeOfDay";
import { WEATHER_PRESETS, WEATHER_ORDER } from "@/data/weather";
import type { RoomFeature, WorldConfig } from "@/data/types";
import { OptionChip, PanelHeader, SectionLabel, ToggleRow } from "@/components/ui/primitives";
import { useStudyScape } from "@/state/store";

const FEATURE_COPY: Record<RoomFeature, { label: string; description: string }> = {
  fireplace: { label: "Fireplace", description: "Warm flickering light across the room" },
  candles: { label: "Candles", description: "Small pools of localised warmth" },
  deskLamp: { label: "Desk Lamp", description: "Focused light on the work surface" },
  window: { label: "Window", description: "Open the view to the outside" },
};

export function AtmospherePanel({ world, onClose }: { world: WorldConfig; onClose?: () => void }) {
  const { atmosphere, setTime, setWeather, setFeature, settings } = useStudyScape();
  // Dev Mode opens every weather, even ones this world doesn't normally offer
  const weathers = settings.devMode
    ? WEATHER_ORDER
    : WEATHER_ORDER.filter((w) => world.supportedWeather.includes(w));

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Atmosphere" subtitle="Shape the light, sky and room" {...(onClose ? { onClose } : {})} />

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
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
          <SectionLabel>Weather</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {weathers.map((w) => (
              <OptionChip key={w} active={atmosphere.weather === w} onClick={() => setWeather(w)}>
                {WEATHER_PRESETS[w].label}
              </OptionChip>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Weather happens outside — you will see it through the {world.windows.length > 1 ? "windows" : "window"}.
          </p>
        </section>

        <section>
          <SectionLabel>In the room</SectionLabel>
          <div className="space-y-2">
            {world.roomFeatures.map((f) => (
              <ToggleRow
                key={f}
                label={FEATURE_COPY[f].label}
                description={FEATURE_COPY[f].description}
                checked={atmosphere.features[f]}
                onChange={(v) => setFeature(f, v)}
              />
            ))}
            {world.roomFeatures.length === 0 && (
              <p className="text-[12px] text-muted-foreground">This world has no interior controls.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
