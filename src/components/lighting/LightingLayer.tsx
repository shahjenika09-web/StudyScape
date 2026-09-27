import { memo } from "react";

import type { SkyPalette } from "@/data/timeOfDay";
import type { RoomFeature, WorldConfig } from "@/data/types";

interface Props {
  world: WorldConfig;
  features: Record<RoomFeature, boolean>;
  sky: SkyPalette;
  flash: number;
  reducedMotion: boolean;
}

/**
 * Local light sources composited over the interior. Each source is a soft
 * falloff anchored to the object that emits it — never a full-screen wash.
 */
function LightingLayerImpl({ world, features, sky, flash, reducedMotion }: Props) {
  const pos = world.featurePositions ?? {};
  const has = (f: RoomFeature) => world.roomFeatures.includes(f);

  const lights: { key: string; x: number; y: number; size: number; color: string; on: boolean; flicker: boolean }[] = [];

  if (has("fireplace") && pos.fireplace) {
    lights.push({
      key: "fire",
      x: pos.fireplace.x,
      y: pos.fireplace.y - 6,
      size: 58,
      color: "oklch(0.78 0.16 48 / 40%)",
      on: features.fireplace,
      flicker: true,
    });
  }
  if (has("candles") && pos.candles) {
    lights.push({
      key: "candles",
      x: pos.candles.x,
      y: pos.candles.y - 4,
      size: 26,
      color: "oklch(0.84 0.13 78 / 32%)",
      on: features.candles,
      flicker: true,
    });
  }
  if (has("deskLamp") && pos.deskLamp) {
    lights.push({
      key: "lamp",
      x: pos.deskLamp.x,
      y: pos.deskLamp.y - 2,
      size: 30,
      color: "oklch(0.9 0.12 88 / 34%)",
      on: features.deskLamp,
      flicker: false,
    });
  }

  return (
    <div className="pointer-events-none absolute inset-0" style={{ mixBlendMode: "screen" }}>
      {/* daylight spilling in through each opening */}
      {features.window &&
        world.windows.map((w) => (
          <div
            key={`spill-${w.id}`}
            className="absolute transition-opacity duration-1000"
            style={{
              left: `${w.x + w.w / 2}%`,
              top: `${w.y + w.h}%`,
              width: `${w.w * 2.2}%`,
              height: `${Math.max(24, w.h)}%`,
              transform: "translate(-50%, -18%)",
              background: `radial-gradient(ellipse at top, ${sky.spill} 0%, transparent 72%)`,
              opacity: (1 - sky.darkness) * 0.34,
              filter: "blur(10px)",
            }}
          />
        ))}

      {lights.map((l) => (
        <div
          key={l.key}
          className="absolute transition-opacity duration-700"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            width: `${l.size}%`,
            aspectRatio: "1.5",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(ellipse, ${l.color} 0%, transparent 68%)`,
            opacity: l.on ? 1 : 0,
            animation: l.on && l.flicker && !reducedMotion ? "ss-flicker 4.2s ease-in-out infinite" : undefined,
            filter: "blur(6px)",
          }}
        />
      ))}

      {/* the room briefly answers a lightning strike */}
      {flash > 0 && (
        <div
          className="absolute inset-0"
          style={{
            opacity: flash * 0.18,
            background: "linear-gradient(180deg, oklch(0.9 0.03 250 / 60%), transparent 70%)",
          }}
        />
      )}
    </div>
  );
}

export const LightingLayer = memo(LightingLayerImpl);
