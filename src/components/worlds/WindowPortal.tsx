import { memo } from "react";

import { OutdoorScene } from "@/components/weather/OutdoorScene";
import { WeatherCanvas } from "@/components/weather/WeatherCanvas";
import { WEATHER_PRESETS } from "@/data/weather";
import type { SkyPalette } from "@/data/timeOfDay";
import type { WeatherKind, WindowRegion, WorldConfig } from "@/data/types";

interface Props {
  region: WindowRegion;
  world: WorldConfig;
  sky: SkyPalette;
  weather: WeatherKind;
  open: boolean;
  reducedMotion: boolean;
  paused: boolean;
  flash: number;
}

function radiusFor(shape: WindowRegion["shape"]): string {
  switch (shape) {
    case "arch":
      return "48% 48% 6px 6px / 34% 34% 6px 6px";
    case "round":
      return "50%";
    case "portal":
      return "999px";
    case "shoji":
      return "4px";
    default:
      return "8px";
  }
}

/**
 * One window: outdoor scenery and weather live inside this clipped box, so
 * weather can never spill onto the room, the avatar or the UI.
 */
function WindowPortalImpl({
  region,
  world,
  sky,
  weather,
  open,
  reducedMotion,
  paused,
  flash,
}: Props) {
  const preset = WEATHER_PRESETS[weather];
  const radius = radiusFor(region.shape);
  const depth = region.depth ?? 0.8;

  return (
    <div
      className="absolute"
      style={{
        left: `${region.x}%`,
        top: `${region.y}%`,
        width: `${region.w}%`,
        height: `${region.h}%`,
      }}
    >
      {/* recessed reveal */}
      <div
        className="absolute -inset-[1.1%] shadow-[inset_0_2px_10px_rgba(0,0,0,0.55)]"
        style={{ borderRadius: radius, background: world.palette.trim }}
      />

      {/* the clipping boundary for everything outdoors */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius: radius, contain: "paint" }}
      >
        <OutdoorScene
          outdoor={world.outdoor}
          sky={sky}
          weather={weather}
          reducedMotion={reducedMotion}
          flash={flash}
        />
        {preset.density > 0 && (
          <WeatherCanvas
            weather={weather}
            windScale={weather === "windy" ? 1.4 : 1}
            depth={depth}
            reducedMotion={reducedMotion}
            paused={paused}
          />
        )}

        {/* water on the glass */}
        {preset.glassWet > 0 && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-1000 mix-blend-screen"
            style={{
              opacity: preset.glassWet * 0.35,
              backgroundImage:
                "radial-gradient(1.6px 5px at 20% 30%, rgba(255,255,255,0.5), transparent), radial-gradient(1.2px 4px at 62% 58%, rgba(255,255,255,0.45), transparent), radial-gradient(1.8px 6px at 82% 22%, rgba(255,255,255,0.4), transparent), radial-gradient(1.3px 4px at 38% 76%, rgba(255,255,255,0.4), transparent)",
              backgroundSize: "38% 42%",
            }}
          />
        )}

        {/* snow banked on the outer sill and frost creeping in from the corners */}
        {world.frost && (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[14%]"
              style={{
                background:
                  "radial-gradient(60% 100% at 30% 100%, oklch(0.97 0.01 240) 0 55%, transparent 58%), radial-gradient(55% 90% at 78% 100%, oklch(0.95 0.015 240) 0 55%, transparent 58%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 0 0, oklch(0.96 0.02 240 / 0.55), transparent 26%), radial-gradient(circle at 100% 0, oklch(0.96 0.02 240 / 0.45), transparent 22%), radial-gradient(circle at 0 100%, oklch(0.96 0.02 240 / 0.6), transparent 30%), radial-gradient(circle at 100% 100%, oklch(0.96 0.02 240 / 0.55), transparent 28%)",
              }}
            />
          </>
        )}

        {/* glass sheen */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(118deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 26%, transparent 46%, rgba(255,255,255,0.07) 74%, transparent 100%)",
          }}
        />

        {/* mullions */}
        {region.mullions && (
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: region.mullions.rows - 1 }).map((_, i) => (
              <div
                key={`r${i}`}
                className="absolute left-0 right-0 h-[3px]"
                style={{
                  top: `${((i + 1) / region.mullions!.rows) * 100}%`,
                  background: world.palette.trim,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                }}
              />
            ))}
            {Array.from({ length: region.mullions.cols - 1 }).map((_, i) => (
              <div
                key={`c${i}`}
                className="absolute bottom-0 top-0 w-[3px]"
                style={{
                  left: `${((i + 1) / region.mullions!.cols) * 100}%`,
                  background: world.palette.trim,
                  boxShadow: "1px 0 3px rgba(0,0,0,0.5)",
                }}
              />
            ))}
          </div>
        )}

        {/* closed state — world specific covering, drawn over the glass */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{ opacity: open ? 0 : 1 }}
        >
          {world.windowOff === "curtains" && (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, ${world.palette.wallTop} 0%, ${world.palette.wallBottom} 12%, ${world.palette.wallTop} 24%, ${world.palette.wallBottom} 36%, ${world.palette.wallTop} 48%, ${world.palette.wallBottom} 60%, ${world.palette.wallTop} 72%, ${world.palette.wallBottom} 84%, ${world.palette.wallTop} 100%)`,
              }}
            />
          )}
          {world.windowOff === "shutters" && (
            <div className="absolute inset-0" style={{ background: world.palette.trim }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 h-[12.5%] border-b"
                  style={{
                    top: `${i * 12.5}%`,
                    borderColor: "rgba(0,0,0,0.35)",
                    background: i % 2 ? "rgba(255,255,255,0.03)" : "transparent",
                  }}
                />
              ))}
            </div>
          )}
          {world.windowOff === "shoji" && (
            <div
              className="absolute inset-0"
              style={{ background: "oklch(0.86 0.02 85 / 0.92)" }}
            />
          )}
          {world.windowOff === "blinds" && (
            <div className="absolute inset-0" style={{ background: "oklch(0.2 0.02 60 / 0.95)" }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 h-[7.1%]"
                  style={{ top: `${i * 7.1}%`, background: i % 2 ? "rgba(255,255,255,0.05)" : "transparent" }}
                />
              ))}
            </div>
          )}
          {world.windowOff === "dome" && (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${world.palette.wallTop}, ${world.palette.wallBottom})`,
              }}
            />
          )}
        </div>
      </div>

      {/* frame */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: radius,
          border: `clamp(4px, 0.9vw, 10px) solid ${world.palette.trim}`,
          boxShadow: `inset 0 0 24px rgba(0,0,0,0.5), 0 6px 22px -10px rgba(0,0,0,0.7)`,
        }}
      />
    </div>
  );
}

export const WindowPortal = memo(WindowPortalImpl);
