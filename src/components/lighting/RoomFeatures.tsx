import { memo, type CSSProperties, type ReactNode } from "react";

import { seeded, u } from "@/components/worlds/units";
import type { FeaturePosition, RoomFeature, WorldConfig } from "@/data/types";

interface Props {
  world: WorldConfig;
  features: Record<RoomFeature, boolean>;
  reducedMotion: boolean;
}

/** w/h in scene units */
function Flame({ w, h, delay, reducedMotion }: { w: number; h: number; delay: number; reducedMotion: boolean }) {
  return (
    <div
      style={{
        width: u(w),
        height: u(h),
        borderRadius: "50% 50% 45% 45% / 62% 62% 38% 38%",
        background:
          "linear-gradient(180deg, oklch(0.97 0.11 92) 0%, oklch(0.85 0.17 68) 45%, oklch(0.68 0.19 35) 100%)",
        filter: "blur(0.4px)",
        transformOrigin: "50% 100%",
        animation: reducedMotion ? undefined : `ss-flame ${1.1 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function anchored(pos: FeaturePosition, extra?: CSSProperties): CSSProperties {
  return {
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    transform: `translate(-50%, calc(-100% - ${u(pos.lift ?? 0)}))`,
    ...extra,
  };
}

function Fire({ on, big, reducedMotion }: { on: boolean; big: boolean; reducedMotion: boolean }) {
  const k = big ? 1.25 : 1;
  return (
    <div className="absolute inset-x-0 bottom-[6%] flex flex-col items-center">
      <div className="flex items-end gap-[1px] transition-opacity duration-700" style={{ opacity: on ? 1 : 0 }}>
        <Flame w={1 * k} h={2 * k} delay={0.1} reducedMotion={reducedMotion} />
        <Flame w={1.6 * k} h={3.4 * k} delay={0} reducedMotion={reducedMotion} />
        <Flame w={1.3 * k} h={2.7 * k} delay={0.3} reducedMotion={reducedMotion} />
        {big && <Flame w={1.1 * k} h={2.2 * k} delay={0.18} reducedMotion={reducedMotion} />}
      </div>
      {/* logs, glowing when lit */}
      <div className="relative" style={{ width: u(7 * k), height: u(1.3 * k) }}>
        <div className="absolute inset-x-0 bottom-0 rounded-full" style={{ height: u(0.9 * k), background: "oklch(0.3 0.05 45)", transform: "rotate(-4deg)" }} />
        <div className="absolute inset-x-[10%] bottom-[20%] rounded-full" style={{ height: u(0.9 * k), background: "oklch(0.34 0.05 50)", transform: "rotate(5deg)" }} />
        <div
          className="absolute inset-x-[15%] bottom-0 rounded-full transition-opacity duration-700"
          style={{
            height: u(0.8 * k),
            opacity: on ? 1 : 0,
            background: "radial-gradient(ellipse, oklch(0.78 0.17 45 / 0.95), transparent 70%)",
            filter: "blur(2px)",
          }}
        />
      </div>
    </div>
  );
}

function Fireplace({ world, pos, on, reducedMotion }: { world: WorldConfig; pos: FeaturePosition; on: boolean; reducedMotion: boolean }) {
  const style = world.featureStyles?.fireplace ?? "stone";
  // the library hearth is old dark masonry; the cabin uses pale river stone
  const stone = style === "cabin" ? "oklch(0.52 0.02 60)" : "oklch(0.38 0.025 48)";
  const stoneDark = style === "cabin" ? "oklch(0.4 0.02 55)" : "oklch(0.3 0.02 45)";
  const stoneLight = style === "cabin" ? "oklch(0.58 0.02 65)" : "oklch(0.44 0.03 52)";

  if (style === "stove") {
    return (
      <>
        {/* flue pipe up to the ceiling */}
        <div
          className="absolute top-0"
          style={{
            left: `${pos.x}%`,
            width: u(1.4),
            height: `calc(${pos.y}% - ${u(9.6)})`,
            transform: "translateX(-50%)",
            background: "linear-gradient(90deg, oklch(0.2 0.01 260), oklch(0.32 0.01 260), oklch(0.2 0.01 260))",
          }}
        />
        <div className="absolute" style={anchored(pos, { width: u(8) })}>
          <svg viewBox="0 0 80 100" style={{ width: "100%", height: "auto", display: "block" }}>
            <rect x="4" y="6" width="72" height="80" rx="6" fill="oklch(0.22 0.01 260)" />
            <rect x="0" y="0" width="80" height="8" rx="3" fill="oklch(0.28 0.01 260)" />
            <rect x="14" y="24" width="52" height="42" rx="4" fill="oklch(0.12 0.02 40)" stroke="oklch(0.35 0.01 260)" strokeWidth="2" />
            <path d="M8 90 L8 100 M72 90 L72 100" stroke="oklch(0.2 0.01 260)" strokeWidth="5" />
            <rect x="30" y="72" width="20" height="4" rx="2" fill="oklch(0.6 0.08 80)" />
          </svg>
          <div className="absolute overflow-hidden rounded-[4px]" style={{ left: "18%", right: "18%", top: "24%", bottom: "34%" }}>
            <Fire on={on} big={false} reducedMotion={reducedMotion} />
          </div>
        </div>
      </>
    );
  }

  const cabin = style === "cabin";
  const W = cabin ? 24 : 22;
  const H = cabin ? 25 : 20;
  return (
    <>
      {/* chimney breast rising to the ceiling */}
      <div
        className="absolute top-0"
        style={{
          left: `${pos.x}%`,
          width: u(cabin ? 17 : 15),
          height: `calc(${pos.y}% - ${u(H - 0.5)})`,
          transform: "translateX(-50%)",
          backgroundColor: cabin ? stone : "oklch(0.36 0.025 45)",
          backgroundImage: `repeating-linear-gradient(180deg, transparent 0 ${u(2.4)}, rgba(0,0,0,0.35) ${u(2.4)} ${u(2.6)}), linear-gradient(90deg, rgba(0,0,0,0.3), transparent 20%, transparent 80%, rgba(0,0,0,0.35))`,
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}
      >
        {cabin && (
          <svg viewBox="0 0 60 60" className="absolute left-1/2 top-[38%] -translate-x-1/2" style={{ width: u(6) }}>
            <circle cx="30" cy="30" r="24" fill="none" stroke="oklch(0.42 0.1 150)" strokeWidth="9" />
            <circle cx="30" cy="30" r="24" fill="none" stroke="oklch(0.34 0.09 155)" strokeWidth="4" strokeDasharray="3 5" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <circle key={a} cx={Math.round((30 + Math.cos((a * Math.PI) / 180) * 24) * 10) / 10} cy={Math.round((30 + Math.sin((a * Math.PI) / 180) * 24) * 10) / 10} r="2.4" fill="oklch(0.6 0.2 25)" />
            ))}
            <path d="M24 52 L30 46 L36 52 L33 60 M27 60 L30 52" stroke="oklch(0.55 0.18 25)" strokeWidth="3" fill="none" />
          </svg>
        )}
      </div>

      <div className="absolute" style={anchored(pos, { width: u(W) })}>
        <svg viewBox={`0 0 ${W * 10} ${H * 10}`} style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
          {/* surround */}
          <rect x="10" y="14" width={W * 10 - 20} height={H * 10 - 24} fill={stone} />
          {Array.from({ length: cabin ? 16 : 12 }, (_, i) => {
            const x = 12 + seeded(i + (cabin ? 50 : 0)) * (W * 10 - 44);
            const y = 18 + seeded(i + 20) * (H * 10 - 50);
            return <rect key={i} x={x} y={y} width={18 + seeded(i + 9) * 14} height={10 + seeded(i + 4) * 6} rx="4" fill={i % 2 ? stoneDark : stoneLight} opacity="0.7" />;
          })}
          {/* firebox */}
          <path
            d={`M${W * 2.4} ${H * 10 - 10} L${W * 2.4} ${H * 5} Q${W * 5} ${H * 2.8} ${W * 7.6} ${H * 5} L${W * 7.6} ${H * 10 - 10} Z`}
            fill="oklch(0.1 0.015 40)"
            stroke="oklch(0.3 0.02 50)"
            strokeWidth="4"
          />
          {/* mantel */}
          <rect x="0" y="4" width={W * 10} height="12" rx="2" fill={cabin ? "oklch(0.36 0.06 50)" : "oklch(0.32 0.06 45)"} />
          <rect x="0" y="4" width={W * 10} height="3" rx="1.5" fill="oklch(0.48 0.07 55)" />
          {/* hearth */}
          <rect x="-8" y={H * 10 - 10} width={W * 10 + 16} height="10" rx="2" fill={stoneDark} />
          {cabin ? (
            <g>
              {/* pine garland with warm lights */}
              <path d={`M4 16 Q${W * 2.5} 34 ${W * 5} 18 Q${W * 7.5} 34 ${W * 10 - 4} 16`} stroke="oklch(0.38 0.09 150)" strokeWidth="9" fill="none" strokeLinecap="round" />
              {[0.1, 0.22, 0.34, 0.5, 0.66, 0.78, 0.9].map((t) => (
                <circle key={t} cx={Math.round(W * 100 * t) / 10} cy={Math.round((26 - Math.sin(t * Math.PI * 2 - Math.PI / 2) * 6) * 10) / 10} r="2.4" fill="oklch(0.9 0.14 80)" />
              ))}
              {/* stockings */}
              {[W * 3, W * 7].map((x, i) => (
                <g key={x}>
                  <path d={`M${x} 16 L${x} 44 L${x + (i ? -10 : 10)} 50 L${x + (i ? -12 : 12)} 42 L${x + 8 * (i ? -1 : 1)} 38 L${x + 8 * (i ? -1 : 1)} 16Z`} fill={i ? "oklch(0.5 0.14 28)" : "oklch(0.42 0.1 150)"} />
                  <rect x={i ? x - 9 : x - 1} y="15" width="10" height="6" fill="oklch(0.94 0.01 90)" />
                </g>
              ))}
            </g>
          ) : (
            <g>
              {/* hourglass, potion and old books on the mantel */}
              <path d="M40 4 L52 4 L47 -6 L52 -16 L40 -16 L45 -6Z" fill="oklch(0.85 0.06 85 / 0.6)" stroke="oklch(0.62 0.1 70)" strokeWidth="1.2" />
              <path d="M70 4 L80 4 L80 -6 L77 -9 L77 -14 L73 -14 L73 -9 L70 -6Z" fill="oklch(0.55 0.15 300 / 0.8)" />
              <circle cx="75" cy="-4" r="2.6" fill="oklch(0.8 0.15 310)" opacity="0.8" />
              <rect x="150" y="-8" width="30" height="6" rx="1" fill="oklch(0.45 0.11 25)" />
              <rect x="152" y="-14" width="26" height="6" rx="1" fill="oklch(0.4 0.07 250)" />
            </g>
          )}
        </svg>
        <div className="absolute" style={{ left: "26%", right: "26%", top: cabin ? "36%" : "34%", bottom: "4%" }}>
          <Fire on={on} big={cabin} reducedMotion={reducedMotion} />
        </div>
      </div>
    </>
  );
}

function Candle({ h, on, delay, reducedMotion, width = 0.7 }: { h: number; on: boolean; delay: number; reducedMotion: boolean; width?: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="transition-opacity duration-500" style={{ opacity: on ? 1 : 0 }}>
        <Flame w={0.42} h={0.95} delay={delay} reducedMotion={reducedMotion} />
      </div>
      <div
        style={{
          width: u(width),
          height: u(h),
          background: "linear-gradient(180deg, oklch(0.93 0.03 85), oklch(0.74 0.04 80))",
          borderRadius: "2px 2px 1px 1px",
        }}
      />
    </div>
  );
}

function Candles({ world, pos, on, reducedMotion }: { world: WorldConfig; pos: FeaturePosition; on: boolean; reducedMotion: boolean }) {
  const style = world.featureStyles?.candles ?? "pillars";

  if (style === "floating") {
    // a drift of candles hanging in the air — the library's signature magic
    const spots = [12, 22, 31, 69, 78, 88, 17, 83];
    return (
      <>
        {spots.map((x, i) => (
          <div key={x} className="absolute" style={{ left: `${x}%`, top: `${pos.y - 6 + seeded(i + 3) * 14}%` }}>
            <div style={{ animation: reducedMotion ? undefined : `ss-bob ${5 + seeded(i) * 3}s ease-in-out ${-seeded(i + 1) * 5}s infinite` }}>
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500"
                style={{
                  width: u(4),
                  height: u(4),
                  opacity: on ? 1 : 0,
                  background: "radial-gradient(circle, oklch(0.9 0.13 80 / 0.4), transparent 65%)",
                }}
              />
              <Candle h={1.8 + seeded(i + 7) * 1.2} on={on} delay={seeded(i) * 0.5} reducedMotion={reducedMotion} width={0.55} />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (style === "lantern") {
    return (
      <div className="absolute" style={anchored(pos, { width: u(2.8) })}>
        <svg viewBox="0 0 28 38" style={{ width: "100%", height: "auto", display: "block" }}>
          <rect x="2" y="0" width="24" height="3" fill="oklch(0.25 0.03 40)" />
          <rect
            x="4"
            y="3"
            width="20"
            height="28"
            fill={on ? "oklch(0.92 0.09 80)" : "oklch(0.8 0.02 85)"}
            style={{ transition: "fill 500ms", animation: on && !reducedMotion ? "ss-flicker 4.4s ease-in-out infinite" : undefined }}
          />
          <path d="M4 12 H24 M4 21 H24 M14 3 V31" stroke="oklch(0.28 0.03 40)" strokeWidth="1" />
          <path d="M4 31 L2 38 M24 31 L26 38" stroke="oklch(0.25 0.03 40)" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  if (style === "votive" || style === "flame") {
    return (
      <div className="absolute flex flex-col items-center" style={anchored(pos)}>
        <div className="transition-opacity duration-500" style={{ opacity: on ? 1 : 0 }}>
          <Flame w={0.45} h={1} delay={0.1} reducedMotion={reducedMotion} />
        </div>
        {style === "votive" && (
          <div
            style={{
              width: u(1.1),
              height: u(1.2),
              marginTop: u(-0.5),
              borderRadius: "2px",
              background: "linear-gradient(180deg, oklch(0.9 0.05 60 / 0.35), oklch(0.8 0.08 50 / 0.55))",
              border: "1px solid oklch(0.95 0.02 80 / 0.5)",
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="absolute flex items-end gap-[3px]" style={anchored(pos)}>
      {[0, 1, 2].map((i) => (
        <Candle key={i} h={1.8 + i * 0.5} on={on} delay={i * 0.18} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
}

/** Physical light objects in the room whose on/off state is driven by the world config. */
function RoomFeaturesImpl({ world, features, reducedMotion }: Props) {
  const pos = world.featurePositions ?? {};
  const has = (f: RoomFeature) => world.roomFeatures.includes(f);
  const out: ReactNode[] = [];

  if (has("fireplace") && pos.fireplace) {
    out.push(<Fireplace key="fire" world={world} pos={pos.fireplace} on={features.fireplace} reducedMotion={reducedMotion} />);
  }
  if (has("candles") && pos.candles) {
    out.push(<Candles key="candles" world={world} pos={pos.candles} on={features.candles} reducedMotion={reducedMotion} />);
  }
  // the desk lamp stands on the study table and is drawn by StudySpot

  return <div className="pointer-events-none absolute inset-0">{out}</div>;
}

export const RoomFeatures = memo(RoomFeaturesImpl);
