import { memo, type CSSProperties } from "react";

import type { ParticleField } from "@/data/types";
import { seeded, u } from "@/components/worlds/units";

function particleStyle(kind: ParticleField["kind"], r: number, r2: number): CSSProperties {
  switch (kind) {
    case "magic":
      return {
        width: u(0.45 + r2 * 0.35),
        height: u(0.45 + r2 * 0.35),
        borderRadius: "50%",
        background: "radial-gradient(circle, oklch(0.97 0.1 90) 0%, oklch(0.85 0.15 75 / 60%) 45%, transparent 70%)",
        boxShadow: "0 0 8px 2px oklch(0.85 0.15 75 / 45%)",
        animation: `ss-glint ${6 + r * 6}s ease-in-out ${-r2 * 10}s infinite`,
      };
    case "glints":
      return {
        width: u(0.3),
        height: u(0.3),
        borderRadius: "50%",
        background: "oklch(0.92 0.06 250)",
        boxShadow: "0 0 6px 1px oklch(0.8 0.1 250 / 60%)",
        animation: `ss-twinkle ${3 + r * 4}s ease-in-out ${-r2 * 6}s infinite`,
      };
    case "embers":
      return {
        width: u(0.3),
        height: u(0.3),
        borderRadius: "50%",
        background: "oklch(0.82 0.17 55)",
        boxShadow: "0 0 5px 1px oklch(0.75 0.18 45 / 80%)",
        animation: `ss-ember ${2.6 + r * 2.4}s ease-out ${-r2 * 5}s infinite`,
      };
    case "petals":
      return {
        width: u(0.9),
        height: u(0.55),
        borderRadius: "70% 10% 70% 10%",
        background: "oklch(0.86 0.08 355)",
        animation: `ss-petal ${12 + r * 8}s linear ${-r2 * 18}s infinite`,
      };
    case "dust":
    default:
      return {
        width: u(0.22),
        height: u(0.22),
        borderRadius: "50%",
        background: "oklch(0.95 0.05 85 / 70%)",
        animation: `ss-mote ${14 + r * 10}s ease-in-out ${-r2 * 20}s infinite`,
      };
  }
}

/** A handful of slow, cheap particles — motes, glints, embers or petals. */
function AmbientParticlesImpl({ fields }: { fields: ParticleField[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {fields.flatMap((f, fi) =>
        Array.from({ length: f.count }, (_, i) => {
          const seed = fi * 97 + i * 13 + f.kind.length;
          const r = seeded(seed);
          const r2 = seeded(seed + 5);
          const rx = seeded(seed + 11);
          const ry = seeded(seed + 23);
          return (
            <span
              key={`${fi}-${i}`}
              className="absolute"
              style={{
                left: `${f.region.x + rx * f.region.w}%`,
                top: `${f.region.y + ry * f.region.h}%`,
                opacity: 0,
                willChange: "transform, opacity",
                ...particleStyle(f.kind, r, r2),
              }}
            />
          );
        }),
      )}
    </div>
  );
}

export const AmbientParticles = memo(AmbientParticlesImpl);
