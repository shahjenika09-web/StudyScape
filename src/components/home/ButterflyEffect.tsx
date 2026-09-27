import { useMemo } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Butterfly {
  id: number;
  top: number;
  left: number;
  scale: number;
  duration: number;
  delay: number;
  hue: string;
}

/**
 * Home-only ambience. This component is mounted exclusively by the Home route —
 * study worlds never render it, so it does not run at all inside a session.
 */
export function ButterflyEffect({ count = 7 }: { count?: number }) {
  const reducedMotion = useReducedMotion();

  const butterflies = useMemo<Butterfly[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: 12 + ((i * 37) % 70),
        left: -10 + ((i * 23) % 40),
        scale: 0.5 + ((i * 13) % 10) / 12,
        duration: 26 + ((i * 7) % 18),
        delay: -(i * 4.3),
        hue: ["oklch(0.82 0.11 60)", "oklch(0.78 0.1 350)", "oklch(0.8 0.09 260)"][i % 3]!,
      })),
    [count],
  );

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {butterflies.map((b) => (
        <div
          key={b.id}
          className="absolute"
          style={{
            top: `${b.top}%`,
            left: `${b.left}%`,
            transform: `scale(${b.scale})`,
            animation: `ss-butterfly-path ${b.duration}s ease-in-out ${b.delay}s infinite alternate`,
            opacity: 0.55,
          }}
        >
          <div style={{ animation: "ss-float 3.4s ease-in-out infinite" }}>
            <svg width="26" height="20" viewBox="0 0 26 20" style={{ perspective: 60 }}>
              <g style={{ transformOrigin: "13px 10px", animation: "ss-wing-left 0.42s ease-in-out infinite" }}>
                <path d="M13 10 C6 1 0 3 2 9 C3 14 9 14 13 10Z" fill={b.hue} opacity="0.9" />
              </g>
              <g style={{ transformOrigin: "13px 10px", animation: "ss-wing-right 0.42s ease-in-out infinite" }}>
                <path d="M13 10 C20 1 26 3 24 9 C23 14 17 14 13 10Z" fill={b.hue} opacity="0.75" />
              </g>
              <rect x="12.2" y="6" width="1.6" height="9" rx="0.8" fill="oklch(0.35 0.03 320)" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
