import { memo } from "react";

import type { OutdoorKind, WeatherKind } from "@/data/types";
import type { SkyPalette } from "@/data/timeOfDay";
import { WEATHER_PRESETS } from "@/data/weather";

interface Props {
  outdoor: OutdoorKind;
  sky: SkyPalette;
  weather: WeatherKind;
  reducedMotion: boolean;
  flash: number;
}

/** Distant silhouettes per outdoor kind, drawn once as inline SVG paths. */
function Scenery({ outdoor, sky, sway }: { outdoor: OutdoorKind; sky: SkyPalette; sway: boolean }) {
  const far = sky.far;
  const near = sky.near;
  const swayStyle = sway
    ? { animation: "ss-sway 9s ease-in-out infinite", transformOrigin: "50% 100%" }
    : undefined;

  switch (outdoor) {
    case "mountains":
      return (
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M0 78 L38 34 L64 62 L92 26 L128 70 L160 44 L200 80 L200 100 L0 100Z" fill={far} opacity="0.85" />
          <path d="M0 88 L44 62 L82 84 L120 58 L168 88 L200 74 L200 100 L0 100Z" fill={near} />
        </svg>
      );
    case "forest":
      return (
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={swayStyle}>
          <path d="M0 84 L20 40 L40 84Z M34 88 L56 34 L78 88Z M70 86 L92 44 L114 86Z M108 88 L132 38 L156 88Z M148 86 L172 48 L196 86Z" fill={far} />
          <rect x="0" y="84" width="200" height="16" fill={near} />
        </svg>
      );
    case "city":
      return (
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <g fill={far}>
            <rect x="4" y="46" width="26" height="54" />
            <rect x="36" y="30" width="22" height="70" />
            <rect x="64" y="54" width="30" height="46" />
            <rect x="100" y="24" width="20" height="76" />
            <rect x="126" y="48" width="28" height="52" />
            <rect x="160" y="36" width="34" height="64" />
          </g>
          <g fill="oklch(0.86 0.11 78)" opacity="0.55">
            {Array.from({ length: 26 }).map((_, i) => (
              <rect key={i} x={8 + (i * 7) % 184} y={34 + ((i * 13) % 56)} width="2.5" height="3" />
            ))}
          </g>
          <rect x="0" y="92" width="200" height="8" fill={near} />
        </svg>
      );
    case "snowfield":
      return (
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M0 70 L46 38 L84 66 L122 34 L166 68 L200 52 L200 100 L0 100Z" fill={far} opacity="0.8" />
          <path d="M0 84 Q50 72 100 84 T200 82 L200 100 L0 100Z" fill="oklch(0.92 0.02 250)" opacity="0.85" />
          <g fill={near} opacity="0.7">
            <path d="M22 84 L28 62 L34 84Z M150 86 L158 60 L166 86Z" />
          </g>
        </svg>
      );
    case "stars":
      return (
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <g fill="oklch(0.97 0.02 250)">
            {Array.from({ length: 60 }).map((_, i) => (
              <circle
                key={i}
                cx={(i * 37) % 200}
                cy={(i * 53) % 96}
                r={i % 9 === 0 ? 1.1 : 0.55}
                opacity={0.3 + ((i * 7) % 10) / 14}
              />
            ))}
          </g>
          <ellipse cx="140" cy="26" rx="12" ry="12" fill="oklch(0.95 0.02 240)" opacity="0.28" />
        </svg>
      );
    case "canopy":
      return (
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={swayStyle}>
          <g fill={far} opacity="0.9">
            <ellipse cx="30" cy="22" rx="46" ry="26" />
            <ellipse cx="110" cy="12" rx="58" ry="30" />
            <ellipse cx="180" cy="28" rx="44" ry="24" />
            <ellipse cx="70" cy="84" rx="50" ry="22" />
            <ellipse cx="164" cy="90" rx="46" ry="20" />
          </g>
          <rect x="86" y="0" width="9" height="100" fill={near} opacity="0.75" />
        </svg>
      );
    case "blossom":
      return (
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={swayStyle}>
          <g fill="oklch(0.78 0.09 350)" opacity="0.75">
            <ellipse cx="40" cy="20" rx="42" ry="22" />
            <ellipse cx="150" cy="16" rx="50" ry="24" />
          </g>
          <path d="M0 88 Q60 78 100 88 T200 84 L200 100 L0 100Z" fill={near} />
          <rect x="30" y="20" width="6" height="70" fill={far} opacity="0.7" />
        </svg>
      );
    case "garden":
    default:
      return (
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={swayStyle}>
          <path d="M0 74 Q40 62 80 74 T160 70 T200 76 L200 100 L0 100Z" fill={far} opacity="0.9" />
          <g fill={near}>
            <ellipse cx="34" cy="60" rx="24" ry="16" />
            <ellipse cx="150" cy="56" rx="30" ry="18" />
            <rect x="32" y="60" width="4" height="26" />
            <rect x="148" y="56" width="4" height="32" />
          </g>
          <path d="M0 90 Q100 82 200 92 L200 100 L0 100Z" fill="oklch(0.4 0.05 160)" opacity="0.6" />
        </svg>
      );
  }
}

/**
 * Everything that exists beyond the glass: sky, sun/stars, silhouettes,
 * overcast and haze. Rendered only inside a window container.
 */
function OutdoorSceneImpl({ outdoor, sky, weather, reducedMotion, flash }: Props) {
  const preset = WEATHER_PRESETS[weather];
  const sway = !reducedMotion && (weather === "windy" || weather === "thunderstorm");

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 transition-[background] duration-[1200ms]"
        style={{
          background: `linear-gradient(180deg, ${sky.sky[0]} 0%, ${sky.sky[1]} 58%, ${sky.sky[2]} 100%)`,
        }}
      />

      {sky.sun && preset.overcast < 0.6 && (
        <div
          className="absolute rounded-full transition-opacity duration-1000"
          style={{
            left: `${sky.sun.x}%`,
            top: `${sky.sun.y}%`,
            width: `${sky.sun.size}%`,
            aspectRatio: "1",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${sky.sun.color} 0%, transparent 68%)`,
            opacity: 1 - preset.overcast,
            filter: "blur(2px)",
          }}
        />
      )}

      <div className="absolute inset-0" style={{ opacity: sky.stars }}>
        <Scenery outdoor="stars" sky={sky} sway={false} />
      </div>

      <Scenery outdoor={outdoor} sky={sky} sway={sway} />

      {/* overcast wash — greys the whole outdoor sky */}
      {preset.overcast > 0.05 && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: preset.overcast * 0.72,
            background: "linear-gradient(180deg, oklch(0.42 0.015 265) 0%, oklch(0.55 0.012 260) 100%)",
            mixBlendMode: "multiply",
          }}
        />
      )}

      {/* overcast cloud bank — outside only */}
      {preset.overcast > 0.05 && (
        <div
          className="absolute inset-x-[-20%] top-0 h-[62%] transition-opacity duration-1000"
          style={{
            opacity: preset.overcast,
            background:
              "radial-gradient(60% 90% at 20% 20%, oklch(0.62 0.02 260 / 85%) 0%, transparent 70%), radial-gradient(55% 80% at 62% 8%, oklch(0.55 0.02 265 / 80%) 0%, transparent 72%), radial-gradient(50% 70% at 90% 26%, oklch(0.5 0.02 268 / 75%) 0%, transparent 70%)",
            animation: reducedMotion ? undefined : "ss-drift 46s ease-in-out infinite alternate",
          }}
        />
      )}

      {/* fog / haze — outside only, thicker at the horizon */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: preset.haze,
          background:
            "linear-gradient(180deg, transparent 0%, oklch(0.86 0.01 260 / 55%) 45%, oklch(0.9 0.008 255 / 85%) 100%)",
          backdropFilter: preset.haze > 0.5 ? "blur(3px)" : undefined,
        }}
      />

      {/* lightning, contained by the window */}
      {preset.lightning && (
        <div
          className="absolute inset-0 transition-opacity duration-100"
          style={{
            opacity: flash * 0.85,
            background:
              "radial-gradient(70% 55% at 50% 12%, oklch(0.99 0.02 250 / 95%) 0%, oklch(0.85 0.03 255 / 40%) 45%, transparent 78%)",
          }}
        />
      )}
    </div>
  );
}

export const OutdoorScene = memo(OutdoorSceneImpl);
