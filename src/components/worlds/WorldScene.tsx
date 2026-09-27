import { memo, type CSSProperties } from "react";

import { Avatar } from "@/components/avatar/Avatar";
import { StudySpot } from "@/components/avatar/StudySpot";
import { LightingLayer } from "@/components/lighting/LightingLayer";
import { RoomFeatures } from "@/components/lighting/RoomFeatures";
import { AmbientParticles } from "@/components/worlds/AmbientParticles";
import { RoomProps } from "@/components/worlds/RoomProps";
import { Surfaces } from "@/components/worlds/Surfaces";
import { SCENE_UNIT } from "@/components/worlds/units";
import { WindowPortal } from "@/components/worlds/WindowPortal";
import { useLightning } from "@/components/weather/useLightning";
import { getSky } from "@/data/timeOfDay";
import { WEATHER_PRESETS } from "@/data/weather";
import type { AvatarAnimation } from "@/data/animations";
import type { RoomFeature, TimeOfDay, WeatherKind, WorldConfig } from "@/data/types";
import type { CameraFrame } from "@/hooks/useCamera";

interface Props {
  world: WorldConfig;
  time: TimeOfDay;
  weather: WeatherKind;
  features: Record<RoomFeature, boolean>;
  reducedMotion: boolean;
  paused?: boolean | undefined;
  camera?: CameraFrame | undefined;
  animation?: AvatarAnimation | null | undefined;
  showAvatar?: boolean | undefined;
  /** small previews skip particles and prop idle loops */
  lite?: boolean | undefined;
  className?: string | undefined;
}

/**
 * A complete world: architecture, windows (which own all outdoor weather),
 * furniture, light sources, the study spot and the avatar. Layer order is fixed
 * so weather can never reach the interior.
 */
function WorldSceneImpl({
  world,
  time,
  weather,
  features,
  reducedMotion,
  paused = false,
  camera,
  animation = null,
  showAvatar = false,
  lite = false,
  className,
}: Props) {
  const sky = getSky(time);
  const preset = WEATHER_PRESETS[weather];
  const flash = useLightning(preset.lightning && !paused, reducedMotion);
  const interiorDim = sky.darkness * (features.window ? 0.55 : 0.75);
  const animate = !paused && !lite;

  return (
    <div
      className={paused ? `${className ?? ""} ss-paused` : className}
      style={{ contain: "layout paint", containerType: "size", "--u": SCENE_UNIT } as CSSProperties}
    >
      <div
        className="absolute inset-0 transition-transform duration-[2600ms]"
        style={{
          transform: camera
            ? `scale(${camera.scale}) translate(${camera.x}%, ${camera.y}%) rotate(${camera.rotate}deg)`
            : undefined,
          transitionTimingFunction: "var(--ease-cinema)",
          willChange: "transform",
        }}
      >
        {/* 1 — wall + floor */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${world.palette.wallTop} 0%, ${world.palette.wallBottom} 62%, ${world.palette.floor} 62.2%, ${world.palette.wallBottom} 100%)`,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[38%]"
          style={{
            background: `linear-gradient(180deg, ${world.palette.floor} 0%, oklch(0.12 0.02 300) 100%)`,
            opacity: 0.9,
          }}
        />
        <Surfaces world={world} />

        {/* 2 — openings; everything outdoors is clipped inside these */}
        {world.windows.map((region) => (
          <WindowPortal
            key={region.id}
            region={region}
            world={world}
            sky={sky}
            weather={weather}
            open={features.window !== false}
            reducedMotion={reducedMotion}
            paused={paused}
            flash={flash}
          />
        ))}

        {/* 3 — interior, dimmed by the time of day */}
        <div
          className="absolute inset-0 transition-[filter] duration-1000"
          style={{ filter: `brightness(${1 - interiorDim}) saturate(${1 - interiorDim * 0.35})` }}
        >
          <RoomProps world={world} animate={animate} reducedMotion={reducedMotion} />
          <RoomFeatures world={world} features={features} reducedMotion={reducedMotion} />
          <StudySpot world={world} features={features} animation={null} reducedMotion={reducedMotion} layer="back" />
          {showAvatar && animation && (
            <Avatar world={world} animation={animation} reducedMotion={reducedMotion} />
          )}
          <StudySpot
            world={world}
            features={features}
            animation={showAvatar ? animation : null}
            reducedMotion={reducedMotion || !animate}
            layer="front"
          />
          <RoomProps world={world} layer="front" animate={animate} reducedMotion={reducedMotion} />
        </div>

        {/* 4 — lighting response */}
        <LightingLayer
          world={world}
          features={features}
          sky={sky}
          flash={flash}
          reducedMotion={reducedMotion}
        />

        {/* 4b — a few slow motes, glints, embers or petals */}
        {animate && !reducedMotion && world.particles && <AmbientParticles fields={world.particles} />}

        {/* 5 — lens vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 45%, transparent 45%, oklch(0.08 0.02 310 / 65%) 100%)",
          }}
        />
      </div>
    </div>
  );
}

export const WorldScene = memo(WorldSceneImpl);
