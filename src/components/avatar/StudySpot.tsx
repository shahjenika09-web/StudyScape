import { memo, useId, type ReactNode } from "react";

import { RigFrame } from "@/components/avatar/rig";
import { TABLE_TOP } from "@/components/avatar/rigGeometry";
import type { AvatarAnimation } from "@/data/animations";
import type { DeskItem, RoomFeature, WorldConfig } from "@/data/types";

const WOOD = "oklch(0.42 0.07 55)";
const WOOD_DARK = "oklch(0.3 0.05 50)";
const WOOD_LIGHT = "oklch(0.52 0.08 60)";

/** a wisp of steam rising from a cup */
export function Steam({ x, y, reducedMotion }: { x: number; y: number; reducedMotion: boolean }) {
  if (reducedMotion) return null;
  return (
    <g transform={`translate(${x} ${y})`} pointerEvents="none">
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d="M0 0 q-2.5 -4 0 -8 q2.5 -4 0 -8"
          transform={`translate(${(i - 1) * 2.4} 0)`}
          stroke="oklch(0.97 0.01 90 / 0.55)"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
          style={{
            animation: `ss-steam ${3.2 + i * 0.4}s ease-out ${i * 1.1}s infinite`,
            transformBox: "fill-box",
            transformOrigin: "50% 100%",
            opacity: 0,
          }}
        />
      ))}
    </g>
  );
}

function Seat({ world }: { world: WorldConfig }) {
  switch (world.avatar.seat) {
    case "cushion":
      return (
        <g>
          <rect x="38" y="158" width="72" height="15" rx="7" fill="oklch(0.36 0.09 25)" />
          <rect x="41" y="159" width="66" height="5" rx="2.5" fill="oklch(0.46 0.1 28)" opacity="0.7" />
          <circle cx="74" cy="165" r="1.6" fill="oklch(0.25 0.05 25)" />
        </g>
      );
    case "armchair":
      return (
        <g>
          <path d="M16 140 C10 104 12 72 28 64 C42 58 52 68 52 88 L52 128 Z" fill="oklch(0.34 0.1 20)" />
          <path d="M22 132 C18 104 20 80 30 74" stroke="oklch(0.42 0.11 22)" strokeWidth="3" fill="none" opacity="0.6" />
          <rect x="24" y="118" width="76" height="16" rx="7" fill="oklch(0.4 0.11 22)" />
          <rect x="22" y="130" width="80" height="30" rx="5" fill="oklch(0.3 0.09 20)" />
          <path d="M22 146 H102" stroke="oklch(0.72 0.11 80)" strokeWidth="1.2" opacity="0.7" />
          <rect x="28" y="160" width="6" height="16" rx="2" fill={WOOD_DARK} />
          <rect x="92" y="160" width="6" height="16" rx="2" fill={WOOD_DARK} />
        </g>
      );
    case "bentwood":
      return (
        <g stroke={WOOD_DARK} strokeLinecap="round" fill="none">
          <path d="M42 128 C28 110 28 86 38 80 C46 77 48 92 45 128" strokeWidth="4.5" />
          <path d="M36 102 C40 100 44 100 46 102" strokeWidth="2.5" />
          <path d="M42 131 L34 176 M86 131 L94 176 M52 131 L50 176 M76 131 L78 176" strokeWidth="3.4" />
          <ellipse cx="64" cy="156" rx="26" ry="3" strokeWidth="2" />
          <rect x="32" y="124" width="60" height="7" rx="3.5" fill={WOOD} stroke="none" />
        </g>
      );
    case "office":
      return (
        <g>
          <rect x="22" y="76" width="14" height="50" rx="7" fill="oklch(0.32 0.03 280)" />
          <rect x="26" y="80" width="6" height="40" rx="3" fill="oklch(0.4 0.04 280)" opacity="0.6" />
          <path d="M30 124 L40 128" stroke="oklch(0.28 0.02 280)" strokeWidth="4" />
          <rect x="32" y="123" width="60" height="10" rx="5" fill="oklch(0.34 0.03 280)" />
          <rect x="58" y="133" width="6" height="26" rx="2" fill="oklch(0.55 0.01 260)" />
          <path d="M38 166 L84 166" stroke="oklch(0.3 0.02 280)" strokeWidth="4" strokeLinecap="round" />
          <path d="M61 159 L61 166" stroke="oklch(0.3 0.02 280)" strokeWidth="4" />
          {[38, 61, 84].map((x) => (
            <circle key={x} cx={x} cy="171" r="3.6" fill="oklch(0.2 0.01 280)" />
          ))}
        </g>
      );
    case "blanketChair":
    case "wood":
    default:
      return (
        <g>
          <rect x="30" y="80" width="8" height="96" rx="3" fill={WOOD_DARK} />
          <rect x="30" y="80" width="8" height="5" rx="2" fill={WOOD_LIGHT} />
          {[92, 104, 116].map((y) => (
            <rect key={y} x="36" y={y} width="4" height="3" fill={WOOD_DARK} />
          ))}
          <rect x="32" y="125" width="60" height="8" rx="3" fill={WOOD} />
          <rect x="82" y="132" width="7" height="44" rx="2" fill={WOOD_DARK} />
          <rect x="36" y="156" width="50" height="3" rx="1" fill={WOOD_DARK} />
          {world.avatar.seat === "blanketChair" && (
            <g>
              <path d="M24 82 C30 76 42 78 44 86 L48 138 C40 142 30 140 26 136 Z" fill="oklch(0.5 0.13 28)" />
              {[92, 104, 116, 128].map((y) => (
                <path key={y} d={`M27 ${y} L46 ${y + 2}`} stroke="oklch(0.86 0.04 85)" strokeWidth="1.6" opacity="0.8" />
              ))}
              <path d="M34 80 L38 140 M40 81 L43 139" stroke="oklch(0.3 0.06 28)" strokeWidth="1.2" opacity="0.7" />
              <path d="M27 136 l-1 5 M32 139 l-0.5 5 M38 140 l0 5 M44 139 l0.5 5" stroke="oklch(0.86 0.04 85)" strokeWidth="1" />
            </g>
          )}
        </g>
      );
  }
}

/** the near armrest of an armchair sits in front of the body */
function SeatFront({ world }: { world: WorldConfig }) {
  if (world.avatar.seat !== "armchair") return null;
  return (
    <g>
      <rect x="30" y="110" width="62" height="17" rx="8" fill="oklch(0.36 0.1 21)" />
      <circle cx="88" cy="118" r="7.5" fill="oklch(0.4 0.11 22)" />
      <circle cx="88" cy="118" r="3" fill="oklch(0.33 0.1 20)" />
    </g>
  );
}

function Table({ world }: { world: WorldConfig }) {
  const t = TABLE_TOP[world.avatar.table];
  switch (world.avatar.table) {
    case "cafeTable":
      return (
        <g>
          <rect x="139" y={t + 5} width="6" height={170 - t - 5} fill="oklch(0.25 0.02 60)" />
          <path d={`M124 176 L160 176 L152 169 L132 169Z`} fill="oklch(0.25 0.02 60)" />
          <rect x="94" y={t} width="96" height="5" rx="2.5" fill="oklch(0.9 0.012 80)" />
          <rect x="96" y={t + 4} width="92" height="2.5" rx="1" fill="oklch(0.62 0.02 70)" />
        </g>
      );
    case "lowTable":
      return (
        <g>
          <rect x="96" y={t + 6} width="6" height={176 - t - 6} rx="1.5" fill="oklch(0.24 0.04 40)" />
          <rect x="176" y={t + 6} width="6" height={176 - t - 6} rx="1.5" fill="oklch(0.24 0.04 40)" />
          <rect x="90" y={t} width="100" height="7" rx="2" fill="oklch(0.32 0.06 38)" />
          <rect x="90" y={t} width="100" height="1.6" rx="0.8" fill="oklch(0.48 0.08 45)" />
        </g>
      );
    case "readingTable":
      return (
        <g fill="oklch(0.34 0.06 48)">
          {[98, 186].map((x) => (
            <g key={x}>
              <rect x={x} y={t + 8} width="7" height={176 - t - 8} rx="2" />
              <ellipse cx={x + 3.5} cy={t + 28} rx="6" ry="5" />
              <ellipse cx={x + 3.5} cy={t + 44} rx="5" ry="3.5" />
            </g>
          ))}
          <rect x="94" y={t + 8} width="104" height="7" rx="1" fill="oklch(0.3 0.05 45)" />
          <rect x="90" y={t} width="110" height="9" rx="2" fill="oklch(0.4 0.07 52)" />
          <path d={`M92 ${t + 6} H198`} stroke="oklch(0.72 0.1 80)" strokeWidth="0.8" opacity="0.6" />
        </g>
      );
    case "cabinDesk":
      return (
        <g>
          <path d={`M102 ${t + 10} L112 176 M118 ${t + 10} L106 176 M180 ${t + 10} L190 176 M196 ${t + 10} L184 176`} stroke={WOOD_DARK} strokeWidth="6" strokeLinecap="round" />
          <rect x="108" y="156" width="80" height="4" fill={WOOD_DARK} />
          <rect x="92" y={t} width="108" height="10" rx="1.5" fill={WOOD} />
          <path d={`M92 ${t + 5} H200`} stroke={WOOD_DARK} strokeWidth="0.8" />
          <ellipse cx="150" cy={t + 2.5} rx="2" ry="1" fill={WOOD_DARK} opacity="0.7" />
        </g>
      );
    case "desk":
    default:
      return (
        <g>
          <rect x="94" y={t + 6} width="6" height={176 - t - 6} fill={WOOD_DARK} />
          <rect x="190" y={t + 6} width="6" height={176 - t - 6} fill={WOOD_DARK} />
          <rect x="112" y={t + 6} width="84" height="12" rx="1" fill="oklch(0.36 0.06 52)" />
          <rect x="146" y={t + 11} width="12" height="2" rx="1" fill="oklch(0.7 0.06 80)" />
          <rect x="92" y={t} width="106" height="7" rx="1.5" fill={WOOD} />
          <rect x="92" y={t} width="106" height="1.5" fill={WOOD_LIGHT} />
        </g>
      );
  }
}

function MainBook({ t, animation, accent, reducedMotion }: { t: number; animation: AvatarAnimation | null; accent: string; reducedMotion: boolean }) {
  if (animation?.motion === "type") {
    return (
      <g>
        <rect x="102" y={t - 2} width="30" height="2.2" rx="1" fill="oklch(0.62 0.01 260)" />
        <path d={`M131 ${t - 2} L136 ${t - 21}`} stroke="oklch(0.55 0.01 260)" strokeWidth="2.6" strokeLinecap="round" />
        <path d={`M129.8 ${t - 3} L134.6 ${t - 20}`} stroke="oklch(0.85 0.06 230)" strokeWidth="1" opacity="0.8" />
      </g>
    );
  }
  if (animation?.bookOpen) {
    return (
      <g>
        <rect x="99" y={t - 2} width="38" height="2" rx="1" fill={accent} opacity="0.85" />
        <path d={`M100 ${t - 2} Q109 ${t - 7} 118 ${t - 5} L118 ${t - 2}Z`} fill="oklch(0.94 0.02 90)" />
        <path d={`M118 ${t - 5} Q127 ${t - 7} 136 ${t - 2} L118 ${t - 2}Z`} fill="oklch(0.88 0.02 90)" />
        {!reducedMotion && (
          <path
            d={`M118 ${t - 5} Q127 ${t - 8} 136 ${t - 3} L118 ${t - 2}Z`}
            fill="oklch(0.96 0.015 90)"
            style={{ animation: "ss-page 14s ease-in-out 3s infinite", transformBox: "fill-box", transformOrigin: "0% 100%" }}
          />
        )}
      </g>
    );
  }
  return (
    <g>
      <rect x="104" y={t - 4} width="26" height="4" rx="1" fill={accent} />
      <rect x="105" y={t - 3.3} width="24" height="1.2" fill="oklch(0.92 0.02 90)" opacity="0.7" />
      <rect x="112" y={t - 5.4} width="16" height="1.4" rx="0.7" fill="oklch(0.3 0.03 260)" />
    </g>
  );
}

const ITEM_WIDTH: Partial<Record<DeskItem, number>> = {
  coffee: 17,
  cake: 23,
  tea: 26,
  cocoa: 13,
  mug: 12,
  stationery: 9,
  succulent: 10,
  inkwell: 12,
  bookPile: 19,
  starMap: 22,
};

function Item({ item, x, t, hidden, reducedMotion }: { item: DeskItem; x: number; t: number; hidden: boolean; reducedMotion: boolean }) {
  switch (item) {
    case "coffee":
      return (
        <g>
          <ellipse cx={x + 8} cy={t - 1} rx="8.5" ry="1.6" fill="oklch(0.92 0.01 90)" />
          {!hidden && (
            <g>
              <path d={`M${x + 2.5} ${t - 11} L${x + 13.5} ${t - 11} L${x + 12.5} ${t - 2} L${x + 3.5} ${t - 2}Z`} fill="oklch(0.96 0.01 90)" />
              <path d={`M${x + 13.3} ${t - 9} q4.5 2 0 5.5`} stroke="oklch(0.96 0.01 90)" strokeWidth="1.6" fill="none" />
              <ellipse cx={x + 8} cy={t - 11} rx="5.5" ry="1" fill="oklch(0.62 0.08 55)" />
              <Steam x={x + 8} y={t - 13} reducedMotion={reducedMotion} />
            </g>
          )}
        </g>
      );
    case "cocoa":
    case "mug": {
      const body = item === "cocoa" ? "oklch(0.55 0.12 30)" : "oklch(0.68 0.08 230)";
      if (hidden) return null;
      return (
        <g>
          <rect x={x + 1} y={t - 12} width="10" height="12" rx="2" fill={body} />
          <path d={`M${x + 11} ${t - 9.5} q4.5 2.5 0 6.5`} stroke={body} strokeWidth="1.8" fill="none" />
          {item === "cocoa" && (
            <g fill="oklch(0.97 0.01 90)">
              <rect x={x + 2.5} y={t - 13.5} width="3" height="2.6" rx="0.6" />
              <rect x={x + 6} y={t - 14} width="3" height="2.6" rx="0.6" />
            </g>
          )}
          <Steam x={x + 6} y={t - 15} reducedMotion={reducedMotion} />
        </g>
      );
    }
    case "tea":
      return (
        <g>
          {!hidden && (
            <g>
              <path d={`M${x} ${t - 10} L${x + 9} ${t - 10} L${x + 8} ${t} L${x + 1} ${t}Z`} fill="oklch(0.62 0.06 150)" />
              <path d={`M${x} ${t - 7.5} H${x + 9}`} stroke="oklch(0.48 0.06 150)" strokeWidth="1" />
              <Steam x={x + 4.5} y={t - 12} reducedMotion={reducedMotion} />
            </g>
          )}
          {/* kyusu teapot with a side handle */}
          <ellipse cx={x + 19} cy={t - 5.5} rx="7" ry="5.5" fill="oklch(0.42 0.08 40)" />
          <path d={`M${x + 12.5} ${t - 6} L${x + 9} ${t - 10}`} stroke="oklch(0.42 0.08 40)" strokeWidth="2" strokeLinecap="round" />
          <path d={`M${x + 25} ${t - 7} L${x + 30} ${t - 9}`} stroke="oklch(0.42 0.08 40)" strokeWidth="2.6" strokeLinecap="round" />
          <rect x={x + 16} y={t - 12.5} width="6" height="2" rx="1" fill="oklch(0.36 0.07 40)" />
        </g>
      );
    case "cake":
      return (
        <g>
          <ellipse cx={x + 11} cy={t - 1} rx="11.5" ry="1.8" fill="oklch(0.95 0.01 90)" />
          <path d={`M${x + 3} ${t - 2} L${x + 17} ${t - 2} L${x + 17} ${t - 11} L${x + 3} ${t - 7}Z`} fill="oklch(0.84 0.07 80)" />
          <path d={`M${x + 3} ${t - 5} L${x + 17} ${t - 6.2}`} stroke="oklch(0.96 0.02 90)" strokeWidth="1.6" />
          <path d={`M${x + 3} ${t - 7} L${x + 17} ${t - 11} L${x + 17} ${t - 12.4} L${x + 3} ${t - 8.4}Z`} fill="oklch(0.97 0.015 90)" />
          <circle cx={x + 14} cy={t - 13.6} r="2.2" fill="oklch(0.58 0.2 25)" />
          <path d={`M${x + 18} ${t - 2.4} L${x + 24} ${t - 4.2}`} stroke="oklch(0.8 0.01 260)" strokeWidth="0.9" strokeLinecap="round" />
        </g>
      );
    case "stationery":
      return (
        <g>
          <path d={`M${x + 2} ${t - 17} L${x + 4} ${t - 9}`} stroke="oklch(0.8 0.14 90)" strokeWidth="1.4" />
          <path d={`M${x + 5} ${t - 18} L${x + 5} ${t - 9}`} stroke="oklch(0.6 0.15 25)" strokeWidth="1.4" />
          <path d={`M${x + 7.5} ${t - 16} L${x + 6} ${t - 9}`} stroke="oklch(0.55 0.1 250)" strokeWidth="1.4" />
          <rect x={x} y={t - 10} width="9" height="10" rx="1.5" fill="oklch(0.5 0.05 300)" />
        </g>
      );
    case "succulent":
      return (
        <g>
          <ellipse cx={x + 5} cy={t - 9} rx="3" ry="4" fill="oklch(0.6 0.1 150)" />
          <ellipse cx={x + 2.5} cy={t - 8} rx="2.4" ry="3.2" fill="oklch(0.55 0.1 150)" transform={`rotate(-30 ${x + 2.5} ${t - 8})`} />
          <ellipse cx={x + 7.5} cy={t - 8} rx="2.4" ry="3.2" fill="oklch(0.55 0.1 150)" transform={`rotate(30 ${x + 7.5} ${t - 8})`} />
          <path d={`M${x} ${t - 7} L${x + 10} ${t - 7} L${x + 9} ${t} L${x + 1} ${t}Z`} fill="oklch(0.6 0.12 45)" />
        </g>
      );
    case "inkwell":
      return (
        <g>
          <path d={`M${x + 4} ${t - 6} C${x + 6} ${t - 16} ${x + 11} ${t - 24} ${x + 14} ${t - 28}`} stroke="oklch(0.92 0.02 90)" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d={`M${x + 4} ${t - 6} C${x + 6} ${t - 16} ${x + 11} ${t - 24} ${x + 14} ${t - 28}`} stroke="oklch(0.7 0.02 90)" strokeWidth="0.6" fill="none" />
          <rect x={x} y={t - 7} width="8" height="7" rx="2" fill="oklch(0.25 0.05 260)" />
          <rect x={x + 2} y={t - 8.5} width="4" height="2" fill="oklch(0.6 0.1 80)" />
        </g>
      );
    case "bookPile":
      return (
        <g>
          <rect x={x} y={t - 4} width="19" height="4" rx="0.8" fill="oklch(0.45 0.1 25)" />
          <rect x={x + 1.5} y={t - 7.8} width="16" height="3.8" rx="0.8" fill="oklch(0.42 0.07 250)" />
          <rect x={x + 0.5} y={t - 11.4} width="17" height="3.6" rx="0.8" fill="oklch(0.55 0.08 140)" />
          <path d={`M${x + 1} ${t - 2} H${x + 18}`} stroke="oklch(0.8 0.1 85)" strokeWidth="0.6" />
        </g>
      );
    case "starMap":
      return (
        <g>
          <rect x={x} y={t - 4} width="18" height="4" rx="2" fill="oklch(0.86 0.04 85)" />
          <circle cx={x + 17} cy={t - 2} r="2.2" fill="oklch(0.4 0.08 260)" />
          <circle cx={x + 11} cy={t - 14} r="6" stroke="oklch(0.72 0.1 80)" strokeWidth="1" fill="none" />
          <ellipse cx={x + 11} cy={t - 14} rx="6" ry="2" stroke="oklch(0.72 0.1 80)" strokeWidth="0.8" fill="none" />
          <path d={`M${x + 11} ${t - 8} L${x + 11} ${t - 4}`} stroke="oklch(0.62 0.09 70)" strokeWidth="1.2" />
        </g>
      );
    default:
      return null;
  }
}

function Lamp({ world, on, glowId }: { world: WorldConfig; on: boolean; glowId: string }) {
  const t = TABLE_TOP[world.avatar.table];
  const glow = on ? 1 : 0;
  const halo = (cx: number, cy: number, r: number) => (
    <circle cx={cx} cy={cy} r={r} fill={`url(#${glowId})`} style={{ opacity: glow, transition: "opacity 500ms" }} />
  );
  switch (world.avatar.table) {
    case "lowTable":
      // andon — a paper floor lantern beside the low table
      return (
        <g>
          {halo(198, 150, 26)}
          <rect x="190" y="136" width="16" height="36" fill={on ? "oklch(0.93 0.08 85)" : "oklch(0.8 0.02 85)"} style={{ transition: "fill 500ms" }} />
          <path d="M190 136 H206 M190 148 H206 M190 160 H206 M198 136 V172" stroke="oklch(0.3 0.04 40)" strokeWidth="1" />
          <rect x="189" y="134" width="18" height="2.5" fill="oklch(0.28 0.04 40)" />
          <path d="M190 172 L189 176 M206 172 L207 176" stroke="oklch(0.28 0.04 40)" strokeWidth="2" />
        </g>
      );
    case "readingTable":
      // banker's lamp
      return (
        <g>
          {halo(180, t - 16, 22)}
          <rect x="172" y={t - 3} width="16" height="3" rx="1" fill="oklch(0.65 0.1 80)" />
          <rect x="179" y={t - 16} width="2" height="13" fill="oklch(0.65 0.1 80)" />
          <path d={`M168 ${t - 16} Q180 ${t - 26} 192 ${t - 16} Z`} fill="oklch(0.42 0.11 155)" />
          <ellipse cx="180" cy={t - 15.5} rx="9" ry="1.3" fill="oklch(0.95 0.1 90)" style={{ opacity: glow, transition: "opacity 500ms" }} />
        </g>
      );
    case "cafeTable":
      // cordless mushroom lamp
      return (
        <g>
          {halo(182, t - 14, 16)}
          <rect x="179" y={t - 11} width="6" height="11" rx="1.5" fill="oklch(0.85 0.02 80)" />
          <path d={`M174 ${t - 10} Q182 ${t - 22} 190 ${t - 10} Z`} fill={on ? "oklch(0.95 0.07 85)" : "oklch(0.86 0.02 80)"} style={{ transition: "fill 500ms" }} />
        </g>
      );
    case "cabinDesk":
      // oil lantern
      return (
        <g>
          {halo(184, t - 12, 20)}
          <rect x="178" y={t - 3} width="12" height="3" rx="1" fill="oklch(0.3 0.03 60)" />
          <ellipse cx="184" cy={t - 11} rx="5" ry="8" fill="oklch(0.9 0.05 85 / 0.35)" stroke="oklch(0.3 0.03 60)" strokeWidth="1" />
          <ellipse cx="184" cy={t - 10} rx="1.6" ry="3.2" fill="oklch(0.9 0.15 75)" style={{ opacity: glow, transition: "opacity 500ms" }} />
          <rect x="180" y={t - 21} width="8" height="2.5" rx="1" fill="oklch(0.3 0.03 60)" />
          <path d={`M180 ${t - 21} Q184 ${t - 29} 188 ${t - 21}`} stroke="oklch(0.3 0.03 60)" strokeWidth="1.2" fill="none" />
        </g>
      );
    case "desk":
    default:
      return (
        <g>
          {halo(168, t - 30, 24)}
          <ellipse cx="186" cy={t - 1.2} rx="7" ry="1.8" fill="oklch(0.3 0.02 260)" />
          <path d={`M186 ${t - 2} L182 ${t - 26} L168 ${t - 34}`} stroke="oklch(0.3 0.02 260)" strokeWidth="2.4" fill="none" strokeLinejoin="round" />
          <path d={`M160 ${t - 30} L172 ${t - 40} L178 ${t - 33} L166 ${t - 24}Z`} fill={on ? "oklch(0.62 0.1 60)" : "oklch(0.36 0.03 260)"} style={{ transition: "fill 500ms" }} />
          <ellipse cx="163.5" cy={t - 26.5} rx="5" ry="2" transform={`rotate(-38 163.5 ${t - 26.5})`} fill="oklch(0.96 0.1 88)" style={{ opacity: glow, transition: "opacity 500ms" }} />
        </g>
      );
  }
}

interface Props {
  world: WorldConfig;
  features: Record<RoomFeature, boolean>;
  animation: AvatarAnimation | null;
  reducedMotion: boolean;
  layer: "back" | "front";
}

/**
 * The avatar's seat (behind the body) and table with its world-specific items
 * (in front). Drawn even when the avatar is hidden so the room looks lived in.
 */
function StudySpotImpl({ world, features, animation, reducedMotion, layer }: Props) {
  const glowId = useId().replace(/:/g, "");
  if (layer === "back") {
    return (
      <RigFrame world={world}>
        <Seat world={world} />
      </RigFrame>
    );
  }

  const t = TABLE_TOP[world.avatar.table];
  const sipping = animation?.motion === "sip";
  const extras = world.avatar.items.filter((i) => i !== "book");
  const placed: ReactNode[] = [];
  let cursor = world.avatar.table === "lowTable" ? 140 : 139;
  let drinkTaken = false;
  for (const item of extras) {
    const isDrink = item === "coffee" || item === "tea" || item === "cocoa" || item === "mug";
    const hidden = sipping && isDrink && !drinkTaken;
    if (isDrink) drinkTaken = true;
    placed.push(<Item key={item} item={item} x={cursor} t={t} hidden={hidden} reducedMotion={reducedMotion} />);
    cursor += (ITEM_WIDTH[item] ?? 12) + 3;
  }

  return (
    <RigFrame world={world}>
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="oklch(0.95 0.12 85)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.95 0.12 85)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <SeatFront world={world} />
      <Table world={world} />
      {world.avatar.items.includes("book") && (
        <MainBook t={t} animation={animation} accent={world.palette.accent} reducedMotion={reducedMotion} />
      )}
      {placed}
      {world.roomFeatures.includes("deskLamp") && <Lamp world={world} on={features.deskLamp} glowId={glowId} />}
    </RigFrame>
  );
}

export const StudySpot = memo(StudySpotImpl);
