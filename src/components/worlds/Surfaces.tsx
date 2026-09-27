import { memo, type CSSProperties } from "react";

import type { FloorStyle, WallStyle, WorldConfig } from "@/data/types";
import { u } from "@/components/worlds/units";

/** an SVG snippet as a repeatable CSS background tile */
function tile(inner: string, w: number, h: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${inner}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const MORTAR = "rgba(10,6,4,0.42)";

const BRICK = tile(
  `<rect width="40" height="20" fill="none"/>` +
    `<rect x="1" y="1" width="18" height="8" fill="rgba(255,255,255,0.05)"/>` +
    `<rect x="21" y="1" width="18" height="8" fill="rgba(0,0,0,0.08)"/>` +
    `<rect x="11" y="11" width="18" height="8" fill="rgba(255,240,220,0.06)"/>` +
    `<path d="M0 0.5H40M0 10.5H40M0.5 0V10M20.5 0V10M10.5 10V20M30.5 10V20" stroke="${MORTAR}" stroke-width="1.1"/>`,
  40,
  20,
);

const STONE = tile(
  `<rect x="1" y="1" width="24" height="13" rx="1.5" fill="rgba(255,255,255,0.05)"/>` +
    `<rect x="27" y="1" width="32" height="13" rx="1.5" fill="rgba(0,0,0,0.07)"/>` +
    `<rect x="1" y="16" width="13" height="13" rx="1.5" fill="rgba(0,0,0,0.05)"/>` +
    `<rect x="16" y="16" width="27" height="13" rx="1.5" fill="rgba(255,235,210,0.05)"/>` +
    `<rect x="45" y="16" width="14" height="13" rx="1.5" fill="rgba(255,255,255,0.03)"/>` +
    `<path d="M0 0.5H60M0 15.2H60M0.5 0V15M26 0V15M14.7 15V30M44.3 15V30" stroke="${MORTAR}" stroke-width="1.3"/>`,
  60,
  30,
);

const TATAMI = tile(
  // two columns of mats, the second offset by half a mat; dark heri borders on the long edges
  `<g stroke="rgba(60,50,20,0.13)" stroke-width="0.35">` +
    Array.from({ length: 18 }, (_, i) => `<path d="M0 ${i * 2 + 1}H36"/>`).join("") +
    `</g>` +
    `<path d="M0.9 0V36M17.1 0V36M18.9 0V36M35.1 0V36" stroke="rgba(35,28,12,0.85)" stroke-width="1.8"/>` +
    `<path d="M0 0.6H18M18 18H36" stroke="rgba(30,24,10,0.6)" stroke-width="1.2"/>` +
    `<path d="M0 1.6H18M18 19H36" stroke="rgba(255,250,220,0.12)" stroke-width="0.8"/>`,
  36,
  36,
);

const FLAGSTONE = tile(
  `<rect x="1" y="1" width="20" height="14" rx="2" fill="rgba(255,255,255,0.05)"/>` +
    `<rect x="23" y="1" width="16" height="14" rx="2" fill="rgba(0,0,0,0.07)"/>` +
    `<rect x="1" y="17" width="12" height="22" rx="2" fill="rgba(0,0,0,0.05)"/>` +
    `<rect x="15" y="17" width="24" height="22" rx="2" fill="rgba(255,255,255,0.04)"/>` +
    `<path d="M0 0.5H40M0 16H40M0.5 0V40M22 0V16M14 16V40" stroke="rgba(0,0,0,0.35)" stroke-width="1"/>`,
  40,
  40,
);

function wallStyle(kind: WallStyle): CSSProperties {
  switch (kind) {
    case "brick":
      return { backgroundImage: BRICK, backgroundSize: `${u(7)} ${u(3.5)}` };
    case "stone":
      return { backgroundImage: STONE, backgroundSize: `${u(15)} ${u(7.5)}` };
    case "logs":
      return {
        backgroundImage: `repeating-linear-gradient(180deg, rgba(255,225,180,0.12) 0, rgba(255,210,160,0.05) ${u(0.9)}, rgba(0,0,0,0.05) ${u(2.2)}, rgba(0,0,0,0.3) ${u(3.1)}, rgba(0,0,0,0.55) ${u(3.4)})`,
      };
    case "planks":
      return {
        backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0.38) 0, rgba(0,0,0,0.38) ${u(0.18)}, rgba(255,255,255,0.03) ${u(0.25)}, rgba(0,0,0,0.04) ${u(2.2)}, rgba(255,255,255,0.03) ${u(4)})`,
      };
    case "wallpaper":
      return {
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,220,230,0.1) 0 ${u(0.35)}, transparent ${u(0.4)}), repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 ${u(1.2)}, transparent ${u(1.2)} ${u(3)})`,
        backgroundSize: `${u(3)} ${u(3)}, auto`,
      };
    case "clay":
      return {
        backgroundImage: `radial-gradient(rgba(255,240,210,0.06) ${u(0.12)}, transparent ${u(0.14)}), radial-gradient(rgba(60,40,20,0.08) ${u(0.1)}, transparent ${u(0.12)})`,
        backgroundSize: `${u(1.3)} ${u(1.1)}, ${u(0.9)} ${u(1.4)}`,
      };
    case "plaster":
    default:
      return {
        backgroundImage:
          "radial-gradient(60% 40% at 30% 30%, rgba(255,240,230,0.06), transparent), radial-gradient(50% 50% at 80% 60%, rgba(0,0,0,0.08), transparent)",
      };
  }
}

function floorStyle(kind: FloorStyle): CSSProperties {
  switch (kind) {
    case "tatami":
      return { backgroundImage: TATAMI, backgroundSize: `${u(18)} ${u(18)}` };
    case "tiles":
      return {
        backgroundImage: "repeating-conic-gradient(rgba(255,245,230,0.2) 0 25%, rgba(0,0,0,0.22) 0 50%)",
        backgroundSize: `${u(6)} ${u(6)}`,
      };
    case "stone":
      return { backgroundImage: FLAGSTONE, backgroundSize: `${u(14)} ${u(14)}` };
    case "planks":
      return {
        backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0.45) 0 ${u(0.2)}, rgba(255,220,180,0.05) ${u(0.3)}, rgba(0,0,0,0.06) ${u(3)}, rgba(255,220,180,0.04) ${u(5.2)})`,
      };
    case "boards":
    default:
      return {
        backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0 ${u(0.15)}, rgba(255,220,180,0.05) ${u(0.22)}, rgba(0,0,0,0.05) ${u(1.6)}, rgba(255,220,180,0.05) ${u(2.8)}), repeating-linear-gradient(180deg, transparent 0 ${u(11)}, rgba(0,0,0,0.25) ${u(11)} ${u(11.2)})`,
      };
  }
}

/**
 * Architecture: wall material, panelling, beams, posts and a perspective floor.
 * Everything here is static — no animation, no per-frame work.
 */
function SurfacesImpl({ world }: { world: WorldConfig }) {
  const s = world.surfaces;
  const post = s.postColor ?? world.palette.trim;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* wall material */}
      <div className="absolute inset-x-0 top-0 h-[62%]" style={wallStyle(s.wall)} />

      {s.wainscot && (
        <div
          className="absolute inset-x-0 top-[47%] h-[15%]"
          style={{
            backgroundImage: `linear-gradient(180deg, ${world.palette.trim} 0 ${u(0.8)}, transparent ${u(0.8)}), repeating-linear-gradient(90deg, rgba(0,0,0,0.35) 0 ${u(0.2)}, rgba(255,230,200,0.05) ${u(0.3)} ${u(6)})`,
            backgroundColor: `color-mix(in oklab, ${world.palette.floor} 75%, black)`,
            boxShadow: "inset 0 6px 10px -6px rgba(0,0,0,0.6)",
          }}
        />
      )}

      {s.beams && (
        <>
          <div
            className="absolute inset-x-0 top-0"
            style={{
              height: u(2.6),
              background: `linear-gradient(180deg, color-mix(in oklab, ${world.palette.trim} 80%, black), ${world.palette.trim})`,
              boxShadow: "0 8px 16px -6px rgba(0,0,0,0.7)",
            }}
          />
          {[12, 37, 63, 88].map((x) => (
            <div
              key={x}
              className="absolute top-0"
              style={{
                left: `${x}%`,
                width: u(2.4),
                height: u(4.2),
                transform: "translateX(-50%)",
                background: `linear-gradient(90deg, ${world.palette.trim}, color-mix(in oklab, ${world.palette.trim} 70%, black))`,
                clipPath: "polygon(0 0, 100% 0, 100% 82%, 86% 100%, 14% 100%, 0 82%)",
                boxShadow: "inset -4px 0 6px rgba(0,0,0,0.35)",
              }}
            />
          ))}
        </>
      )}

      {s.posts && (
        <>
          {s.posts.map((x) => (
            <div
              key={x}
              className="absolute top-0"
              style={{
                left: `${x}%`,
                bottom: "37.5%",
                width: u(1.7),
                transform: "translateX(-50%)",
                background: `linear-gradient(90deg, color-mix(in oklab, ${post} 70%, black), ${post} 35%, color-mix(in oklab, ${post} 80%, white) 55%, ${post} 75%, color-mix(in oklab, ${post} 60%, black))`,
                boxShadow: "4px 0 10px -4px rgba(0,0,0,0.6)",
              }}
            />
          ))}
          {/* nageshi — the horizontal tie beam across the posts */}
          <div
            className="absolute inset-x-0"
            style={{
              top: "8.5%",
              height: u(1.2),
              background: `linear-gradient(180deg, color-mix(in oklab, ${post} 85%, white), ${post} 40%, color-mix(in oklab, ${post} 60%, black))`,
              boxShadow: "0 4px 8px -3px rgba(0,0,0,0.6)",
            }}
          />
        </>
      )}

      {/* perspective floor: a flat plane laid back into the room */}
      <div
        className="absolute inset-x-0 bottom-0 top-[62%] overflow-hidden"
        style={{ perspective: "76cqh", perspectiveOrigin: "50% -60%" }}
      >
        <div
          className="absolute bottom-0 left-[-50%] h-[200%] w-[200%]"
          style={{
            ...floorStyle(s.floor),
            transform: "rotateX(90deg)",
            transformOrigin: "50% 100%",
          }}
        />
      </div>

      {/* skirting + contact shadow where wall meets floor */}
      <div
        className="absolute inset-x-0 top-[62%]"
        style={{ height: u(0.7), marginTop: u(-0.7), background: world.palette.trim, opacity: 0.9 }}
      />
      <div
        className="absolute inset-x-0 top-[62%] h-[5%]"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45), transparent)" }}
      />
    </div>
  );
}

export const Surfaces = memo(SurfacesImpl);
