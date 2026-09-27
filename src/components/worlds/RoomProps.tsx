import { memo, type CSSProperties, type ReactNode } from "react";

import { Steam } from "@/components/avatar/StudySpot";
import { Cat } from "@/components/worlds/Cat";
import { seeded, u } from "@/components/worlds/units";
import type { PropKind, RoomProp, WorldConfig } from "@/data/types";

/** props that hang from their anchor (usually the ceiling) instead of standing on it */
const HANGING = new Set<PropKind>(["pendant", "hangingPlant", "lantern", "hangingLantern", "windChime", "leaves", "curtains"]);
/** flat or animated props skip the drop shadow (a filter would repaint every frame) */
const NO_SHADOW = new Set<PropKind>(["rug", "fairyLights", "banquette", "frames", "starChart", "sign", "menuBoard"]);

const WOOD = "oklch(0.4 0.07 55)";
const WOOD_DARK = "oklch(0.28 0.05 50)";
const WOOD_LIGHT = "oklch(0.52 0.08 62)";
const BRASS = "oklch(0.72 0.11 80)";
const LEAF = "oklch(0.5 0.1 145)";
const LEAF_DARK = "oklch(0.4 0.09 150)";
const BOOK_TONES = [
  "oklch(0.45 0.11 25)",
  "oklch(0.4 0.07 250)",
  "oklch(0.5 0.09 140)",
  "oklch(0.58 0.1 70)",
  "oklch(0.36 0.06 300)",
  "oklch(0.52 0.05 40)",
  "oklch(0.3 0.04 60)",
];
const HOME_TONES = [
  "oklch(0.7 0.08 20)",
  "oklch(0.62 0.07 230)",
  "oklch(0.75 0.08 90)",
  "oklch(0.6 0.08 160)",
  "oklch(0.55 0.06 300)",
  "oklch(0.85 0.03 80)",
];

function Svg({ w, vb, children, style }: { w: number; vb: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <svg viewBox={vb} style={{ width: u(w), height: "auto", display: "block", overflow: "visible", ...style }}>
      {children}
    </svg>
  );
}

/** a shelf row filled with books of varied height, width and lean */
function BookRow({ x0, x1, base, maxH, seed, tones }: { x0: number; x1: number; base: number; maxH: number; seed: number; tones: string[] }) {
  const books: ReactNode[] = [];
  let x = x0;
  let i = 0;
  while (x < x1 - 4) {
    const r = seeded(seed + i * 7);
    const w = 4 + Math.round(r * 5);
    if (x + w > x1) break;
    const h = maxH * (0.62 + seeded(seed + i * 3) * 0.34);
    const tone = tones[Math.floor(seeded(seed + i * 11) * tones.length)]!;
    const lean = seeded(seed + i * 5) > 0.9 && x + w + 6 < x1;
    books.push(
      <g key={i} transform={lean ? `rotate(14 ${x + w} ${base})` : undefined}>
        <rect x={x} y={base - h} width={w} height={h} rx="0.8" fill={tone} />
        <rect x={x} y={base - h * 0.78} width={w} height="1.2" fill="oklch(0.82 0.09 85 / 0.55)" />
      </g>,
    );
    x += w + (seeded(seed + i * 13) > 0.85 ? 5 : 0.6);
    i++;
  }
  return <>{books}</>;
}

function Bookcase({ variant = "a", world }: { variant?: string | undefined; world: WorldConfig }) {
  const home = variant.startsWith("home");
  const H = home ? 200 : 330;
  const rows = home ? 4 : 7;
  const inner = H - 26;
  const seed = variant.charCodeAt(0) * 17;
  const frame = home ? "oklch(0.78 0.03 80)" : world.palette.trim;
  const back = home ? "oklch(0.68 0.03 80)" : "oklch(0.2 0.03 40)";
  return (
    <Svg w={11} vb={`0 0 110 ${H}`}>
      {!home && <rect x="-3" y="0" width="116" height="12" rx="2" fill={frame} />}
      <rect x="0" y={home ? 0 : 8} width="110" height={H - (home ? 0 : 8)} rx="2" fill={frame} />
      <rect x="6" y={home ? 6 : 16} width="98" height={inner - (home ? 0 : 4)} fill={back} />
      {Array.from({ length: rows }, (_, r) => {
        const top = (home ? 6 : 16) + (r * inner) / rows;
        const base = top + inner / rows - 3;
        return (
          <g key={r}>
            <BookRow x0={8} x1={102} base={base} maxH={inner / rows - 6} seed={seed + r * 31} tones={home ? HOME_TONES : BOOK_TONES} />
            <rect x="4" y={base} width="102" height="4" fill={frame} />
          </g>
        );
      })}
      {home && (
        <g>
          <path d="M70 -1 L74 -12 L86 -12 L90 -1Z" fill="oklch(0.62 0.12 45)" />
          <ellipse cx="80" cy="-16" rx="9" ry="7" fill={LEAF} />
          <ellipse cx="74" cy="-20" rx="5" ry="4" fill={LEAF_DARK} />
          <rect x="16" y="-14" width="20" height="14" rx="1" fill="oklch(0.3 0.03 40)" />
          <rect x="18.5" y="-11.5" width="15" height="9" fill="oklch(0.72 0.08 220)" />
        </g>
      )}
      {!home && <rect x="0" y={H - 6} width="110" height="6" fill={WOOD_DARK} />}
      {variant.includes("ivy") && (
        <g fill={LEAF}>
          <path d="M84 6 C88 30 80 50 86 78 C90 96 84 112 88 130" stroke={LEAF_DARK} strokeWidth="1.4" fill="none" />
          {[12, 26, 40, 54, 68, 82, 96, 110, 124].map((y, i) => (
            <ellipse key={y} cx={86 + (i % 2 ? 5 : -4)} cy={y} rx="4.5" ry="3" transform={`rotate(${i % 2 ? 30 : -30} ${86 + (i % 2 ? 5 : -4)} ${y})`} />
          ))}
          <path d="M20 6 C16 24 24 38 18 56" stroke={LEAF_DARK} strokeWidth="1.2" fill="none" />
          {[14, 28, 42, 54].map((y, i) => (
            <ellipse key={y} cx={19 + (i % 2 ? 4 : -4)} cy={y} rx="4" ry="2.8" />
          ))}
        </g>
      )}
    </Svg>
  );
}

function BookStack({ variant }: { variant?: string | undefined }) {
  const b = variant === "b";
  const rows = b ? [34, 30, 36, 28] : [40, 34, 38, 30, 36];
  return (
    <Svg w={b ? 4.5 : 5} vb={`0 0 50 ${rows.length * 8}`}>
      {rows.map((w, i) => (
        <g key={i}>
          <rect x={(50 - w) / 2 + (i % 2 ? 3 : -3)} y={rows.length * 8 - (i + 1) * 8} width={w} height="7.4" rx="1" fill={BOOK_TONES[(i + (b ? 2 : 0)) % BOOK_TONES.length]} />
          <rect x={(50 - w) / 2 + (i % 2 ? 3 : -3) + w - 4} y={rows.length * 8 - (i + 1) * 8 + 1} width="3" height="5.4" fill="oklch(0.92 0.02 90)" opacity="0.8" />
        </g>
      ))}
    </Svg>
  );
}

function Plant({ variant = "fern" }: { variant?: string | undefined }) {
  if (variant === "monstera") {
    return (
      <Svg w={9} vb="0 0 90 130">
        {[
          [44, 40, -30],
          [30, 58, -55],
          [60, 52, 35],
          [48, 22, 5],
          [66, 76, 60],
          [24, 84, -70],
        ].map(([x, y, rot], i) => (
          <g key={i} transform={`rotate(${rot} ${x} ${y})`}>
            <path d={`M${x} ${y! + 22} L${x} ${y}`} stroke={LEAF_DARK} strokeWidth="2" />
            <ellipse cx={x} cy={y} rx="15" ry="11" fill={i % 2 ? LEAF_DARK : LEAF} />
            <path d={`M${x! - 11} ${y! - 3} L${x! - 4} ${y} M${x! + 11} ${y! - 3} L${x! + 4} ${y} M${x! - 10} ${y! + 5} L${x! - 3} ${y! + 2}`} stroke="oklch(0.25 0.03 60)" strokeWidth="1.6" />
          </g>
        ))}
        <path d="M28 98 L62 98 L58 130 L32 130Z" fill="oklch(0.86 0.02 80)" />
        <rect x="26" y="96" width="38" height="5" rx="2" fill="oklch(0.8 0.02 80)" />
      </Svg>
    );
  }
  if (variant === "bonsai") {
    return (
      <Svg w={8} vb="0 0 80 70">
        <path d="M40 58 C38 46 30 40 34 30 C38 22 46 26 48 18" stroke="oklch(0.35 0.05 50)" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <ellipse cx="26" cy="30" rx="15" ry="8" fill={LEAF_DARK} />
        <ellipse cx="50" cy="16" rx="16" ry="8" fill={LEAF} />
        <ellipse cx="58" cy="34" rx="10" ry="6" fill={LEAF_DARK} />
        <path d="M12 58 L68 58 L64 68 L16 68Z" fill="oklch(0.4 0.06 40)" />
      </Svg>
    );
  }
  // fern: arching fronds, each a stem lined with small leaflets
  return (
    <Svg w={8} vb="0 0 80 100">
      {[-62, -38, -14, 10, 34, 58].map((rot, i) => (
        <g key={rot} transform={`rotate(${rot} 40 66)`}>
          <path d="M40 66 C40 48 43 32 38 16" stroke={LEAF_DARK} strokeWidth="1.4" fill="none" />
          {[58, 50, 42, 34, 26, 20].map((y, j) => {
            const size = 5.5 - j * 0.6;
            const cx = 40 + (y < 40 ? 1.5 : 0.5);
            return (
              <g key={y} fill={i % 2 ? LEAF : LEAF_DARK}>
                <ellipse cx={cx - size * 0.8} cy={y} rx={size} ry={size * 0.38} transform={`rotate(-28 ${cx - size * 0.8} ${y})`} />
                <ellipse cx={cx + size * 0.8} cy={y} rx={size} ry={size * 0.38} transform={`rotate(28 ${cx + size * 0.8} ${y})`} />
              </g>
            );
          })}
        </g>
      ))}
      <path d="M24 66 L56 66 L52 98 L28 98Z" fill="oklch(0.55 0.1 45)" />
      <rect x="22" y="63" width="36" height="6" rx="2" fill="oklch(0.6 0.1 45)" />
    </Svg>
  );
}

function Bed({ world, animate, withCat }: { world: WorldConfig; animate: boolean; withCat: boolean }) {
  const duvet = `color-mix(in oklab, ${world.palette.accent} 45%, oklch(0.85 0.02 80))`;
  return (
    <div className="relative">
      <Svg w={30} vb="0 0 300 140">
        <rect x="0" y="14" width="16" height="126" rx="4" fill={WOOD} />
        <rect x="-2" y="10" width="20" height="10" rx="4" fill={WOOD_LIGHT} />
        <rect x="286" y="70" width="14" height="70" rx="4" fill={WOOD} />
        <rect x="10" y="100" width="282" height="16" rx="3" fill={WOOD_DARK} />
        <rect x="16" y="128" width="8" height="12" fill={WOOD_DARK} />
        <rect x="276" y="128" width="8" height="12" fill={WOOD_DARK} />
        <rect x="14" y="80" width="276" height="24" rx="8" fill="oklch(0.92 0.015 85)" />
        <rect x="20" y="58" width="50" height="22" rx="10" fill="oklch(0.95 0.01 90)" />
        <rect x="26" y="50" width="46" height="18" rx="9" fill={`color-mix(in oklab, ${world.palette.accent} 30%, white)`} />
        <path d="M66 74 C120 62 220 64 292 72 L294 116 C220 124 120 122 62 116 Z" fill={duvet} />
        <path d="M66 74 C70 88 68 104 62 116" stroke="oklch(1 0 0 / 0.25)" strokeWidth="3" fill="none" />
        <path d="M70 74 C74 70 84 68 92 69 L88 116 L66 116Z" fill="oklch(0.95 0.01 90)" opacity="0.85" />
        <path d="M110 92 C160 86 220 88 280 94" stroke="oklch(0 0 0 / 0.12)" strokeWidth="2" fill="none" />
        {/* knit throw at the foot */}
        <path d="M206 66 C230 64 260 66 290 70 L292 118 C262 122 232 122 202 120 Z" fill="oklch(0.84 0.05 85)" />
        {[214, 226, 238, 250, 262, 274].map((x) => (
          <path key={x} d={`M${x} 68 L${x - 2} 120`} stroke="oklch(0.74 0.05 80)" strokeWidth="2" />
        ))}
      </Svg>
      {withCat && (
        <div className="absolute" style={{ left: "36%", top: "26%", width: "20%" }}>
          <Cat animate={animate} />
        </div>
      )}
    </div>
  );
}

function Rug({ variant = "round", world }: { variant?: string | undefined; world: WorldConfig }) {
  if (variant === "ornate") {
    return (
      <Svg w={42} vb="0 0 420 60">
        <ellipse cx="210" cy="30" rx="210" ry="30" fill="oklch(0.36 0.1 22)" />
        <ellipse cx="210" cy="30" rx="196" ry="26" fill="none" stroke="oklch(0.7 0.11 80)" strokeWidth="3" />
        <ellipse cx="210" cy="30" rx="170" ry="21" fill="none" stroke="oklch(0.28 0.08 250)" strokeWidth="6" />
        <ellipse cx="210" cy="30" rx="70" ry="11" fill="oklch(0.28 0.08 250)" />
        <ellipse cx="210" cy="30" rx="40" ry="6" fill="oklch(0.7 0.11 80)" opacity="0.8" />
      </Svg>
    );
  }
  if (variant === "braided") {
    return (
      <Svg w={40} vb="0 0 400 60">
        {["oklch(0.45 0.1 30)", "oklch(0.72 0.05 80)", "oklch(0.4 0.07 150)", "oklch(0.6 0.09 60)", "oklch(0.45 0.1 30)"].map((c, i) => (
          <ellipse key={i} cx="200" cy="30" rx={200 - i * 36} ry={30 - i * 5.4} fill={c} />
        ))}
      </Svg>
    );
  }
  return (
    <Svg w={36} vb="0 0 360 60">
      <ellipse cx="180" cy="30" rx="180" ry="30" fill={`color-mix(in oklab, ${world.palette.accent} 35%, oklch(0.8 0.02 80))`} opacity="0.85" />
      <ellipse cx="180" cy="30" rx="150" ry="24" fill="none" stroke="oklch(1 0 0 / 0.25)" strokeWidth="3" />
    </Svg>
  );
}

function Counter({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Svg w={26} vb="0 0 260 150">
      {/* espresso machine */}
      <rect x="20" y="10" width="70" height="42" rx="5" fill="oklch(0.78 0.02 250)" />
      <rect x="20" y="10" width="70" height="8" rx="4" fill="oklch(0.88 0.01 250)" />
      <rect x="28" y="22" width="54" height="12" rx="3" fill="oklch(0.5 0.12 25)" />
      <circle cx="42" cy="28" r="3" fill="oklch(0.9 0.02 90)" />
      <circle cx="68" cy="28" r="3" fill="oklch(0.9 0.02 90)" />
      <rect x="36" y="36" width="12" height="5" rx="1" fill="oklch(0.3 0.02 250)" />
      <rect x="62" y="36" width="12" height="5" rx="1" fill="oklch(0.3 0.02 250)" />
      <rect x="26" y="50" width="58" height="3" fill="oklch(0.35 0.02 250)" />
      {[28, 40, 52, 64].map((x) => (
        <rect key={x} x={x} y="2" width="9" height="8" rx="1.5" fill="oklch(0.96 0.01 90)" />
      ))}
      <Steam x={42} y={34} reducedMotion={reducedMotion} />
      {/* pastry case */}
      <rect x="108" y="16" width="84" height="36" rx="4" fill="oklch(0.9 0.03 220 / 0.25)" stroke="oklch(0.9 0.02 220 / 0.6)" strokeWidth="1.5" />
      <rect x="110" y="34" width="80" height="2" fill="oklch(0.9 0.02 220 / 0.5)" />
      <path d="M116 32 q8 -9 16 0Z" fill="oklch(0.72 0.12 70)" />
      <path d="M138 32 q8 -9 16 0Z" fill="oklch(0.72 0.12 70)" />
      <path d="M162 33 L178 33 L178 24 L162 28Z" fill="oklch(0.55 0.1 40)" />
      <path d="M162 28 L178 24 L178 22 L162 26Z" fill="oklch(0.95 0.02 90)" />
      <circle cx="122" cy="47" r="5" fill="oklch(0.68 0.1 60)" />
      <circle cx="136" cy="47" r="5" fill="oklch(0.62 0.12 30)" />
      <path d="M150 50 L170 50 L168 42 L152 42Z" fill="oklch(0.85 0.08 350)" />
      <circle cx="160" cy="40" r="2.5" fill="oklch(0.58 0.2 25)" />
      {/* cup stack and tip jar */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M206 ${52 - i * 6} L220 ${52 - i * 6} L219 ${46 - i * 6} L207 ${46 - i * 6}Z`} fill="oklch(0.95 0.01 90)" stroke="oklch(0.8 0.01 90)" strokeWidth="0.5" />
      ))}
      <rect x="228" y="36" width="16" height="16" rx="3" fill="oklch(0.9 0.03 220 / 0.3)" stroke="oklch(0.9 0.02 220 / 0.6)" />
      {/* counter body */}
      <rect x="0" y="52" width="260" height="10" rx="2" fill="oklch(0.86 0.015 80)" />
      <rect x="4" y="62" width="252" height="88" fill={WOOD} />
      {Array.from({ length: 21 }, (_, i) => (
        <rect key={i} x={8 + i * 12} y="66" width="2" height="80" fill={WOOD_DARK} opacity="0.55" />
      ))}
      <rect x="4" y="142" width="252" height="8" fill={WOOD_DARK} />
    </Svg>
  );
}

function MenuBoard() {
  return (
    <Svg w={14} vb="0 0 140 110">
      <rect x="0" y="0" width="140" height="110" rx="4" fill={WOOD} />
      <rect x="6" y="6" width="128" height="98" rx="2" fill="oklch(0.25 0.02 160)" />
      <g fill="oklch(0.93 0.02 90)" fontFamily="Georgia, serif">
        <text x="70" y="26" textAnchor="middle" fontSize="14" letterSpacing="3">
          MENU
        </text>
        {[
          ["Latte", "4.5"],
          ["Mocha", "5"],
          ["Matcha", "5"],
          ["Cake", "6"],
        ].map(([name, price], i) => (
          <g key={name} fontSize="9.5" opacity="0.85">
            <text x="18" y={46 + i * 15}>
              {name}
            </text>
            <text x="122" y={46 + i * 15} textAnchor="end">
              {price}
            </text>
          </g>
        ))}
      </g>
      <path d="M18 32 H122" stroke="oklch(0.93 0.02 90 / 0.4)" strokeDasharray="3 3" />
      <circle cx="116" cy="20" r="4" fill="oklch(0.75 0.12 80)" opacity="0.7" />
    </Svg>
  );
}

function WallShelf({ variant = "home" }: { variant?: string | undefined }) {
  let items: ReactNode = null;
  if (variant === "cafe") {
    items = (
      <g>
        {[14, 36, 58].map((x, i) => (
          <g key={x}>
            <rect x={x} y="22" width="18" height="22" rx="3" fill="oklch(0.9 0.02 220 / 0.35)" stroke="oklch(0.9 0.02 220 / 0.6)" />
            <rect x={x + 1} y={30 - i * 3} width="16" height={13 + i * 3} rx="2" fill={["oklch(0.3 0.05 50)", "oklch(0.55 0.1 60)", "oklch(0.7 0.08 90)"][i]} />
            <rect x={x - 1} y="18" width="20" height="5" rx="2" fill={WOOD_DARK} />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${92 + i * 3} ${44 - i * 7} L${108 + i * 3} ${44 - i * 7} L${107 + i * 3} ${38 - i * 7} L${93 + i * 3} ${38 - i * 7}Z`} fill={["oklch(0.9 0.02 90)", "oklch(0.62 0.1 30)", "oklch(0.7 0.07 220)"][i]} />
        ))}
        <path d="M128 44 L146 44 L143 32 L131 32Z" fill="oklch(0.6 0.11 45)" />
        <path d="M137 32 C130 22 128 34 124 46 M137 32 C144 20 150 30 154 44" stroke={LEAF} strokeWidth="3" fill="none" />
      </g>
    );
  } else if (variant === "cabin") {
    items = (
      <g>
        <BookRow x0={10} x1={60} base={44} maxH={26} seed={5} tones={BOOK_TONES} />
        <rect x="72" y="26" width="16" height="18" rx="3" fill="oklch(0.9 0.02 220 / 0.3)" stroke="oklch(0.9 0.02 220 / 0.6)" />
        <rect x="73" y="32" width="14" height="11" rx="2" fill="oklch(0.55 0.13 25)" />
        <path d="M108 44 L126 44 L117 16Z" fill="oklch(0.38 0.07 155)" />
        <path d="M134 44 L152 44 L150 36 L136 36Z" fill={WOOD_LIGHT} />
        <path d="M143 36 L143 30" stroke="oklch(0.3 0.03 60)" strokeWidth="2" />
      </g>
    );
  } else if (variant === "plants") {
    items = (
      <g>
        <rect x="70" y="30" width="14" height="14" rx="2" fill="oklch(0.9 0.02 220 / 0.3)" stroke="oklch(0.9 0.02 220 / 0.6)" />
        <path d="M110 44 L132 44 L128 30 L114 30Z" fill="oklch(0.6 0.11 45)" />
        <path d="M121 30 C112 40 116 56 110 70 M121 30 C130 44 126 58 132 74" stroke={LEAF} strokeWidth="3" fill="none" />
        {[40, 52, 64].map((y) => (
          <ellipse key={y} cx={y === 52 ? 128 : 113} cy={y} rx="4" ry="3" fill={LEAF_DARK} />
        ))}
      </g>
    );
  } else {
    items = (
      <g>
        <BookRow x0={10} x1={70} base={44} maxH={26} seed={9} tones={HOME_TONES} />
        <rect x="84" y="22" width="22" height="22" rx="1.5" fill="oklch(0.3 0.03 40)" />
        <rect x="87" y="25" width="16" height="16" fill="oklch(0.78 0.08 30)" />
        <path d="M122 44 L140 44 L137 32 L125 32Z" fill="oklch(0.86 0.02 80)" />
        <ellipse cx="131" cy="27" rx="9" ry="6" fill={LEAF} />
      </g>
    );
  }
  return (
    <Svg w={16} vb="0 0 160 60">
      {items}
      <rect x="0" y="44" width="160" height="6" rx="1.5" fill={WOOD} />
      <path d="M20 50 L20 58 L30 50 M140 50 L140 58 L130 50" stroke={WOOD_DARK} strokeWidth="3" fill="none" />
    </Svg>
  );
}

function CafeSet() {
  const chair = (x: number, flip: boolean) => (
    <g transform={flip ? `translate(${x * 2} 0) scale(-1 1)` : undefined} stroke={WOOD_DARK} strokeLinecap="round" fill="none">
      <path d={`M${x} 60 C${x - 8} 48 ${x - 8} 30 ${x - 2} 26 C${x + 3} 24 ${x + 4} 34 ${x + 2} 60`} strokeWidth="3" />
      <path d={`M${x} 62 L${x - 4} 90 M${x + 26} 62 L${x + 30} 90`} strokeWidth="2.4" />
      <rect x={x - 2} y="58" width="32" height="5" rx="2.5" fill={WOOD} stroke="none" />
    </g>
  );
  return (
    <Svg w={14} vb="0 0 140 90">
      {chair(14, false)}
      {chair(126, true)}
      <rect x="67" y="19" width="6" height="66" fill="oklch(0.25 0.02 60)" />
      <path d="M54 90 L86 90 L80 84 L60 84Z" fill="oklch(0.25 0.02 60)" />
      <rect x="30" y="14" width="80" height="5" rx="2.5" fill="oklch(0.9 0.012 80)" />
      <ellipse cx="96" cy="13.5" rx="7" ry="1.4" fill="oklch(0.92 0.01 90)" />
      <path d="M91 13 L101 13 L100 6 L92 6Z" fill="oklch(0.96 0.01 90)" />
      <path d="M40 13.5 L46 13.5 L45 6 L41 6Z" fill="oklch(0.85 0.05 200 / 0.6)" />
      <path d="M43 6 C41 1 45 -2 43 -5" stroke={LEAF} strokeWidth="1.4" fill="none" />
    </Svg>
  );
}

function Pendant({ variant, animate }: { variant?: string | undefined; animate: boolean }) {
  const globe = variant === "b";
  return (
    <div className="flex h-full flex-col items-center" style={{ animation: animate ? "ss-pendant 9s ease-in-out infinite" : undefined, transformOrigin: "50% 0" }}>
      <div className="flex-1" style={{ width: 1.5, background: "oklch(0.2 0.02 40)" }} />
      <div className="relative">
        <div
          className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: u(12), height: u(12), background: "radial-gradient(circle, oklch(0.9 0.13 80 / 0.45), transparent 65%)" }}
        />
        <Svg w={globe ? 3.6 : 5} vb={globe ? "0 0 36 40" : "0 0 50 34"}>
          {globe ? (
            <>
              <rect x="14" y="0" width="8" height="6" rx="1" fill={BRASS} />
              <circle cx="18" cy="22" r="16" fill="oklch(0.95 0.08 85 / 0.55)" stroke="oklch(0.95 0.05 85 / 0.7)" />
              <circle cx="18" cy="22" r="5" fill="oklch(0.98 0.1 88)" />
            </>
          ) : (
            <>
              <rect x="21" y="0" width="8" height="6" rx="1" fill="oklch(0.25 0.03 40)" />
              <path d="M2 30 C4 12 14 5 25 5 C36 5 46 12 48 30Z" fill="oklch(0.34 0.06 150)" />
              <ellipse cx="25" cy="30" rx="23" ry="3" fill="oklch(0.28 0.05 150)" />
              <ellipse cx="25" cy="31" rx="7" ry="3" fill="oklch(0.98 0.1 88)" />
            </>
          )}
        </Svg>
      </div>
    </div>
  );
}

function HangingPlant({ variant, animate }: { variant?: string | undefined; animate: boolean }) {
  return (
    <div className="flex h-full flex-col items-center" style={{ animation: animate ? "ss-pendant 11s ease-in-out infinite" : undefined, transformOrigin: "50% 0" }}>
      <div className="flex-1" style={{ width: 1.2, background: "oklch(0.7 0.04 70)" }} />
      <Svg w={variant === "b" ? 6 : 7} vb="0 0 70 70">
        <path d="M35 0 L14 18 M35 0 L56 18" stroke="oklch(0.7 0.04 70)" strokeWidth="1" />
        <path d="M14 18 L56 18 L52 36 L18 36Z" fill={variant === "b" ? "oklch(0.86 0.02 80)" : "oklch(0.58 0.11 45)"} />
        <path d="M18 34 C12 46 16 58 10 70 M30 36 C28 50 32 60 28 72 M52 34 C58 48 54 58 60 68" stroke={LEAF_DARK} strokeWidth="1.4" fill="none" />
        {[
          [11, 44],
          [15, 56],
          [10, 66],
          [29, 48],
          [31, 60],
          [55, 44],
          [57, 56],
          [58, 66],
          [35, 14],
          [22, 14],
          [48, 14],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="5" ry="3.4" fill={i % 2 ? LEAF : LEAF_DARK} transform={`rotate(${i % 2 ? 25 : -25} ${x} ${y})`} />
        ))}
      </Svg>
    </div>
  );
}

function PaperLantern({ animate }: { animate: boolean }) {
  return (
    <div className="flex h-full flex-col items-center" style={{ animation: animate ? "ss-pendant 10s ease-in-out infinite" : undefined, transformOrigin: "50% 0" }}>
      <div className="flex-1" style={{ width: 1.2, background: "oklch(0.2 0.02 40)" }} />
      <div className="relative">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: u(11),
            height: u(11),
            background: "radial-gradient(circle, oklch(0.88 0.13 70 / 0.4), transparent 65%)",
            animation: animate ? "ss-flicker 5s ease-in-out infinite" : undefined,
          }}
        />
        <Svg w={4.2} vb="0 0 42 60">
          <rect x="12" y="0" width="18" height="5" rx="1" fill="oklch(0.22 0.03 40)" />
          <ellipse cx="21" cy="30" rx="20" ry="25" fill="oklch(0.9 0.1 75)" />
          {[12, 18, 24, 30, 36, 42, 48].map((y) => (
            <path key={y} d={`M${21 - Math.sqrt(Math.max(0, 1 - ((y - 30) / 25) ** 2)) * 20} ${y} H${21 + Math.sqrt(Math.max(0, 1 - ((y - 30) / 25) ** 2)) * 20}`} stroke="oklch(0.7 0.1 60)" strokeWidth="0.8" />
          ))}
          <path d="M21 16 L21 44" stroke="oklch(0.55 0.15 30)" strokeWidth="3" opacity="0.55" />
          <rect x="12" y="54" width="18" height="5" rx="1" fill="oklch(0.22 0.03 40)" />
        </Svg>
      </div>
    </div>
  );
}

function Tokonoma({ world }: { world: WorldConfig }) {
  return (
    <Svg w={22} vb="0 0 220 400">
      <rect x="0" y="0" width="220" height="400" fill="oklch(0.36 0.03 62)" />
      <rect x="0" y="0" width="220" height="34" fill={world.palette.trim} />
      <rect x="0" y="0" width="12" height="400" fill="oklch(0.42 0.06 60)" />
      <path d="M4 40 C8 120 3 220 7 390" stroke="oklch(0.3 0.05 55)" strokeWidth="1.2" fill="none" opacity="0.6" />
      {/* hanging scroll */}
      <rect x="70" y="52" width="80" height="4" rx="2" fill="oklch(0.28 0.04 40)" />
      <rect x="74" y="56" width="72" height="232" fill="oklch(0.44 0.05 60)" />
      <rect x="80" y="70" width="60" height="196" fill="oklch(0.9 0.02 85)" />
      <circle cx="120" cy="104" r="11" fill="oklch(0.62 0.13 30)" opacity="0.8" />
      <path d="M84 220 L100 180 L110 196 L124 160 L140 208 L140 250 L84 250Z" fill="oklch(0.3 0.02 250)" opacity="0.55" />
      <path d="M88 236 L106 206 L120 226 L136 214" stroke="oklch(0.2 0.02 250)" strokeWidth="2" fill="none" opacity="0.5" />
      <rect x="70" y="288" width="80" height="6" rx="3" fill="oklch(0.28 0.04 40)" />
      {/* ikebana */}
      <path d="M172 368 L196 368 L192 340 L176 340Z" fill="oklch(0.3 0.03 40)" />
      <path d="M184 340 C180 300 170 280 160 262 M184 340 C190 310 200 296 208 280 M184 340 C184 320 186 306 184 296" stroke="oklch(0.4 0.06 60)" strokeWidth="1.8" fill="none" />
      <circle cx="160" cy="262" r="5" fill="oklch(0.8 0.08 355)" />
      <circle cx="208" cy="280" r="4" fill="oklch(0.86 0.06 355)" />
      <ellipse cx="185" cy="298" rx="6" ry="3" fill={LEAF} />
      <ellipse cx="172" cy="286" rx="5" ry="2.6" fill={LEAF_DARK} transform="rotate(-30 172 286)" />
      {/* tokoita platform */}
      <rect x="0" y="368" width="220" height="32" fill="oklch(0.3 0.05 45)" />
      <rect x="0" y="368" width="220" height="4" fill="oklch(0.48 0.07 55)" />
    </Svg>
  );
}

function Curtains({ world, animate }: { world: WorldConfig; animate: boolean }) {
  const fabric = `color-mix(in oklab, ${world.palette.accent} 55%, oklch(0.55 0.04 320))`;
  const panel = (side: "left" | "right") => (
    <div
      className="absolute top-0 h-full"
      style={{
        [side]: 0,
        width: u(7),
        background: `repeating-linear-gradient(90deg, ${fabric} 0 ${u(0.9)}, color-mix(in oklab, ${fabric} 75%, black) ${u(1.4)}, ${fabric} ${u(1.8)})`,
        clipPath: side === "left" ? "polygon(0 0, 100% 0, 100% 52%, 55% 62%, 70% 100%, 0 100%)" : "polygon(0 0, 100% 0, 100% 100%, 30% 100%, 45% 62%, 0 52%)",
        animation: animate ? `ss-curtain ${9 + (side === "left" ? 0 : 2)}s ease-in-out infinite` : undefined,
        transformOrigin: "50% 0",
        boxShadow: "inset 0 -20px 30px -20px rgba(0,0,0,0.5)",
      }}
    />
  );
  return (
    <div className="relative h-full w-full">
      {panel("left")}
      {panel("right")}
      <div className="absolute inset-x-[-2%] top-0 rounded-full" style={{ height: u(0.6), background: BRASS }} />
    </div>
  );
}

function FairyLights({ animate }: { animate: boolean }) {
  const swags = 3;
  const bulbs: ReactNode[] = [];
  const perSwag = 7;
  for (let s = 0; s < swags; s++) {
    for (let i = 0; i < perSwag; i++) {
      const t = (i + 0.5) / perSwag;
      const x = ((s + t) / swags) * 100;
      // rounded so server and client agree exactly on the markup
      const y = Math.round(Math.sin(t * Math.PI) * 1000) / 10;
      const idx = s * perSwag + i;
      bulbs.push(
        <span
          key={idx}
          className="absolute rounded-full"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: u(0.45),
            height: u(0.45),
            transform: "translate(-50%, -20%)",
            background: "oklch(0.92 0.12 85)",
            boxShadow: "0 0 6px 2px oklch(0.85 0.14 75 / 0.6)",
            animation: animate ? `ss-twinkle ${2.6 + seeded(idx) * 2.5}s ease-in-out ${-seeded(idx + 3) * 4}s infinite` : undefined,
          }}
        />,
      );
    }
  }
  return (
    <div className="relative w-full" style={{ height: u(2.4) }}>
      <svg viewBox="0 0 300 10" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
        <path d="M0 0 Q50 20 100 0 Q150 20 200 0 Q250 20 300 0" stroke="oklch(0.25 0.02 60)" strokeWidth="0.6" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      {bulbs}
    </div>
  );
}

function Frames() {
  return (
    <Svg w={16} vb="0 0 160 60">
      <rect x="0" y="6" width="56" height="42" rx="2" fill={WOOD_DARK} />
      <rect x="5" y="11" width="46" height="32" fill="oklch(0.78 0.06 60)" />
      <path d="M5 43 L20 26 L30 36 L38 28 L51 43Z" fill="oklch(0.5 0.08 150)" />
      <circle cx="40" cy="19" r="4" fill="oklch(0.92 0.08 85)" />
      <rect x="66" y="0" width="30" height="40" rx="2" fill="oklch(0.9 0.02 85)" />
      <rect x="70" y="4" width="22" height="32" fill="oklch(0.6 0.08 250)" />
      <circle cx="81" cy="18" r="6" fill="oklch(0.85 0.06 30)" />
      <circle cx="130" cy="26" r="22" fill={BRASS} />
      <circle cx="130" cy="26" r="18" fill="oklch(0.75 0.03 240)" />
      <path d="M118 18 L126 12" stroke="oklch(1 0 0 / 0.5)" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

function Skis() {
  return (
    <Svg w={4} vb="0 0 40 180">
      <path d="M8 178 L16 4 Q18 -4 22 4 L14 178Z" fill="oklch(0.55 0.15 28)" />
      <path d="M20 178 L28 8 Q30 0 34 8 L26 178Z" fill="oklch(0.5 0.12 250)" />
      <path d="M6 176 L2 30 M36 176 L38 40" stroke="oklch(0.6 0.01 260)" strokeWidth="2" />
      <circle cx="2" cy="150" r="4" fill="none" stroke="oklch(0.3 0.02 260)" strokeWidth="1.5" />
    </Svg>
  );
}

function HangingLantern({ animate }: { animate: boolean }) {
  return (
    <div className="flex h-full flex-col items-center" style={{ animation: animate ? "ss-pendant 12s ease-in-out infinite" : undefined, transformOrigin: "50% 0" }}>
      <div className="flex-1" style={{ width: 1.5, background: "oklch(0.25 0.02 60)" }} />
      <div className="relative">
        <div
          className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: u(10),
            height: u(10),
            background: "radial-gradient(circle, oklch(0.88 0.14 65 / 0.45), transparent 65%)",
            animation: animate ? "ss-flicker 4.6s ease-in-out infinite" : undefined,
          }}
        />
        <Svg w={3.2} vb="0 0 32 50">
          <path d="M10 6 Q16 -4 22 6" stroke="oklch(0.25 0.02 60)" strokeWidth="1.5" fill="none" />
          <path d="M6 6 L26 6 L22 12 L10 12Z" fill="oklch(0.25 0.02 60)" />
          <rect x="8" y="12" width="16" height="28" rx="3" fill="oklch(0.9 0.08 80 / 0.5)" stroke="oklch(0.25 0.02 60)" strokeWidth="1.4" />
          <ellipse cx="16" cy="28" rx="3" ry="6" fill="oklch(0.9 0.15 75)" />
          <rect x="6" y="40" width="20" height="5" rx="1" fill="oklch(0.25 0.02 60)" />
        </Svg>
      </div>
    </div>
  );
}

function WindChime({ variant, animate }: { variant?: string | undefined; animate: boolean }) {
  return (
    <div
      className="flex h-full flex-col items-center"
      style={{ animation: animate ? `ss-pendant ${variant === "b" ? 5 : 6}s ease-in-out infinite` : undefined, transformOrigin: "50% 0" }}
    >
      <div className="flex-1" style={{ width: 1, background: "oklch(0.8 0.02 80 / 0.7)" }} />
      <Svg w={2.2} vb="0 0 22 50">
        <path d="M2 14 C2 2 20 2 20 14Z" fill={variant === "b" ? "oklch(0.8 0.08 200 / 0.8)" : "oklch(0.85 0.08 350 / 0.85)"} />
        <path d="M11 14 L11 22" stroke="oklch(0.8 0.02 80)" strokeWidth="0.8" />
        <rect x="6" y="22" width="10" height="26" rx="1" fill="oklch(0.95 0.02 85)" />
        <path d="M8 28 L14 28 M8 32 L13 32" stroke="oklch(0.4 0.05 30)" strokeWidth="0.8" />
      </Svg>
    </div>
  );
}

function Leaves({ variant, animate }: { variant?: string | undefined; animate: boolean }) {
  return (
    <div style={{ animation: animate ? `ss-sway ${variant === "b" ? 11 : 9}s ease-in-out infinite` : undefined, transformOrigin: "50% 0" }}>
      <Svg w={18} vb="0 0 180 120">
        <path d="M180 0 C140 20 110 40 60 70 M130 26 C120 60 100 80 96 110 M90 50 C70 60 50 90 20 100" stroke="oklch(0.32 0.05 60)" strokeWidth="3" fill="none" />
        {Array.from({ length: 16 }, (_, i) => {
          const x = 30 + seeded(i + (variant === "b" ? 40 : 0)) * 150;
          const y = 5 + seeded(i + 20) * 105;
          return <ellipse key={i} cx={x} cy={y} rx="11" ry="6" fill={i % 3 ? LEAF : LEAF_DARK} transform={`rotate(${seeded(i + 7) * 120 - 60} ${x} ${y})`} opacity="0.95" />;
        })}
      </Svg>
    </div>
  );
}

function StoneLantern() {
  const stone = "oklch(0.6 0.01 80)";
  const dark = "oklch(0.48 0.01 80)";
  return (
    <Svg w={6} vb="0 0 60 140">
      <path d="M22 0 L38 0 L36 8 L24 8Z" fill={dark} />
      <path d="M2 30 L30 10 L58 30 Z" fill={stone} />
      <rect x="4" y="28" width="52" height="5" fill={dark} />
      <rect x="12" y="33" width="36" height="22" fill={stone} />
      <rect x="20" y="37" width="20" height="14" fill="oklch(0.2 0.02 60)" />
      <rect x="8" y="55" width="44" height="6" fill={dark} />
      <rect x="22" y="61" width="16" height="60" fill={stone} />
      <rect x="10" y="121" width="40" height="8" fill={dark} />
      <rect x="4" y="129" width="52" height="11" rx="2" fill={stone} />
    </Svg>
  );
}

function Armchair({ variant }: { variant?: string | undefined }) {
  const plaid = variant === "plaid";
  const body = plaid ? "oklch(0.42 0.07 45)" : "oklch(0.34 0.1 20)";
  const light = plaid ? "oklch(0.5 0.08 48)" : "oklch(0.42 0.11 22)";
  return (
    <Svg w={12} vb="0 0 120 110">
      <path d="M8 90 C4 50 6 16 24 8 C40 2 52 10 54 30 L56 80Z" fill={body} />
      <path d="M14 80 C12 50 14 26 26 18" stroke={light} strokeWidth="3" fill="none" opacity="0.6" />
      <rect x="18" y="66" width="92" height="20" rx="8" fill={light} />
      <rect x="14" y="80" width="100" height="22" rx="5" fill={body} />
      <rect x="84" y="56" width="30" height="36" rx="10" fill={body} />
      <rect x="18" y="100" width="7" height="10" rx="2" fill={WOOD_DARK} />
      <rect x="102" y="100" width="7" height="10" rx="2" fill={WOOD_DARK} />
      {plaid ? (
        <g>
          <path d="M22 16 C34 10 48 14 52 26 L58 76 C44 82 30 80 22 76Z" fill="oklch(0.52 0.14 28)" />
          {[26, 38, 50, 62].map((y) => (
            <path key={y} d={`M24 ${y} L56 ${y + 4}`} stroke="oklch(0.3 0.05 150)" strokeWidth="2.2" />
          ))}
          <path d="M34 14 L40 78 M44 16 L50 78" stroke="oklch(0.85 0.05 85)" strokeWidth="1.2" opacity="0.7" />
        </g>
      ) : null}
      <rect x="30" y="54" width="22" height="16" rx="6" fill={plaid ? "oklch(0.8 0.05 85)" : "oklch(0.7 0.11 80)"} transform="rotate(-12 41 62)" />
    </Svg>
  );
}

function SideTable({ variant, reducedMotion }: { variant?: string | undefined; reducedMotion: boolean }) {
  return (
    <Svg w={6} vb="0 0 60 70">
      <rect x="27" y="6" width="6" height="58" fill={WOOD_DARK} />
      <path d="M14 70 L46 70 L40 64 L20 64Z" fill={WOOD_DARK} />
      <rect x="4" y="2" width="52" height="5" rx="2.5" fill={WOOD} />
      {variant === "cocoa" ? (
        <g>
          <rect x="18" y="-11" width="11" height="13" rx="2" fill="oklch(0.55 0.12 30)" />
          <path d="M29 -8 q4.5 2.5 0 6.5" stroke="oklch(0.55 0.12 30)" strokeWidth="1.8" fill="none" />
          <Steam x={23} y={-13} reducedMotion={reducedMotion} />
          <rect x="34" y="-4" width="16" height="6" rx="1" fill="oklch(0.45 0.1 25)" />
        </g>
      ) : (
        <g>
          <rect x="10" y="-4" width="30" height="6" rx="1" fill={BOOK_TONES[0]} />
          <rect x="13" y="-9" width="26" height="5" rx="1" fill={BOOK_TONES[1]} />
          <rect x="11" y="-14" width="28" height="5" rx="1" fill={BOOK_TONES[3]} />
          <path d="M44 2 L44 -12" stroke="oklch(0.92 0.02 90)" strokeWidth="3" />
          <path d="M44 -12 C43 -15 45 -17 44 -19" stroke="oklch(0.9 0.15 75)" strokeWidth="1.6" />
        </g>
      )}
    </Svg>
  );
}

function Globe() {
  return (
    <Svg w={6} vb="0 0 60 100">
      <path d="M18 100 L30 72 L42 100" stroke={WOOD_DARK} strokeWidth="3.5" fill="none" />
      <rect x="27" y="58" width="6" height="16" fill={WOOD_DARK} />
      <circle cx="30" cy="32" r="22" fill="oklch(0.55 0.07 220)" />
      <path d="M14 22 C18 14 28 14 30 20 C32 26 24 28 26 34 C27 40 20 44 16 38 C12 32 11 27 14 22Z" fill="oklch(0.66 0.09 120)" />
      <path d="M36 16 C42 14 48 20 47 28 C46 34 40 32 37 27 C34 23 33 18 36 16Z" fill="oklch(0.66 0.09 120)" />
      <path d="M34 40 C38 38 44 42 42 47 C38 50 33 46 34 40Z" fill="oklch(0.66 0.09 120)" />
      <circle cx="30" cy="32" r="26" stroke={BRASS} strokeWidth="2.2" fill="none" />
      <path d="M30 6 L30 60" stroke={BRASS} strokeWidth="2" />
    </Svg>
  );
}

function Ladder() {
  return (
    <Svg w={7} vb="0 0 70 300">
      <path d="M44 300 L14 0 M66 300 L36 0" stroke={WOOD} strokeWidth="5" />
      {Array.from({ length: 11 }, (_, i) => {
        const y = 20 + i * 26;
        const off = (y / 300) * 30;
        return <path key={i} d={`M${14 + off} ${y} L${36 + off} ${y}`} stroke={WOOD_LIGHT} strokeWidth="3.5" />;
      })}
      <circle cx="46" cy="296" r="4" fill={BRASS} />
      <circle cx="66" cy="296" r="4" fill={BRASS} />
    </Svg>
  );
}

function FloatingBook({ variant, animate }: { variant?: string | undefined; animate: boolean }) {
  const cover = variant === "b" ? "oklch(0.42 0.08 250)" : "oklch(0.45 0.11 25)";
  return (
    <div style={{ animation: animate ? `ss-bob ${variant === "b" ? 7 : 6}s ease-in-out ${variant === "b" ? -2 : 0}s infinite` : undefined }}>
      <div
        className="absolute left-1/2 top-full -translate-x-1/2 rounded-full"
        style={{ width: u(6), height: u(1.4), background: "radial-gradient(closest-side, oklch(0.85 0.15 75 / 0.55), transparent)" }}
      />
      <Svg w={5} vb="0 0 50 30">
        <path d="M2 18 L25 14 L48 18 L48 22 L25 18 L2 22Z" fill={cover} />
        <path d="M4 16 Q14 6 25 12 L25 18 L4 20Z" fill="oklch(0.94 0.02 90)" />
        <path d="M46 16 Q36 6 25 12 L25 18 L46 20Z" fill="oklch(0.88 0.02 90)" />
        <path d="M8 14 L20 12 M8 16.5 L20 14.5 M30 12 L42 14 M30 14.5 L42 16.5" stroke="oklch(0.5 0.03 60 / 0.5)" strokeWidth="0.6" />
      </Svg>
    </div>
  );
}

function Telescope() {
  return (
    <Svg w={18} vb="0 0 180 200">
      <path d="M90 196 L56 120 M90 196 L124 120 M90 196 L92 126" stroke={WOOD} strokeWidth="6" strokeLinecap="round" />
      <circle cx="90" cy="118" r="10" fill={BRASS} />
      <g transform="rotate(-38 90 112)">
        <rect x="22" y="100" width="130" height="22" rx="10" fill={BRASS} />
        <rect x="22" y="100" width="130" height="7" rx="3.5" fill="oklch(0.84 0.09 85)" opacity="0.6" />
        <rect x="140" y="94" width="26" height="34" rx="6" fill="oklch(0.62 0.1 78)" />
        <rect x="8" y="104" width="18" height="14" rx="4" fill="oklch(0.3 0.03 260)" />
        <rect x="60" y="88" width="30" height="8" rx="4" fill="oklch(0.62 0.1 78)" />
      </g>
    </Svg>
  );
}

function Orrery({ animate }: { animate: boolean }) {
  return (
    <Svg w={9} vb="0 0 90 110">
      <path d="M30 110 L60 110 L54 102 L36 102Z" fill={WOOD_DARK} />
      <rect x="43" y="46" width="4" height="56" fill={BRASS} />
      <ellipse cx="45" cy="40" rx="40" ry="10" stroke={BRASS} strokeWidth="0.8" fill="none" opacity="0.6" />
      <ellipse cx="45" cy="40" rx="24" ry="6" stroke={BRASS} strokeWidth="0.8" fill="none" opacity="0.6" />
      <g style={{ animation: animate ? "ss-orbit 70s linear infinite" : undefined, transformOrigin: "45px 40px" }}>
        <path d="M45 40 L85 40" stroke={BRASS} strokeWidth="1.2" />
        <circle cx="85" cy="40" r="5" fill="oklch(0.6 0.1 220)" />
      </g>
      <g style={{ animation: animate ? "ss-orbit 34s linear infinite reverse" : undefined, transformOrigin: "45px 40px" }}>
        <path d="M45 40 L21 40" stroke={BRASS} strokeWidth="1.2" />
        <circle cx="21" cy="40" r="3.4" fill="oklch(0.65 0.13 40)" />
      </g>
      <circle cx="45" cy="40" r="8" fill="oklch(0.85 0.14 85)" />
    </Svg>
  );
}

function StarChart({ variant }: { variant?: string | undefined }) {
  const stars = [
    [20, 24],
    [34, 16],
    [48, 30],
    [62, 22],
    [78, 40],
    [92, 30],
    [40, 58],
    [66, 64],
    [96, 60],
  ];
  return (
    <Svg w={12} vb="0 0 120 90">
      {variant === "b" ? <circle cx="60" cy="45" r="44" fill={BRASS} /> : <rect x="0" y="0" width="120" height="90" rx="3" fill={WOOD_DARK} />}
      {variant === "b" ? <circle cx="60" cy="45" r="40" fill="oklch(0.24 0.06 265)" /> : <rect x="5" y="5" width="110" height="80" fill="oklch(0.24 0.06 265)" />}
      <path d="M20 24 L34 16 L48 30 L62 22 L78 40 L92 30 M40 58 L66 64 L96 60 M48 30 L40 58" stroke="oklch(0.85 0.05 250 / 0.5)" strokeWidth="0.8" fill="none" />
      {stars.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 ? 1.4 : 2.2} fill="oklch(0.95 0.05 90)" />
      ))}
      <circle cx="60" cy="45" r="30" stroke="oklch(0.72 0.1 80 / 0.4)" strokeWidth="0.6" fill="none" />
    </Svg>
  );
}

function Logs() {
  return (
    <Svg w={11} vb="0 0 110 64">
      {[
        [18, 52],
        [42, 52],
        [66, 52],
        [90, 52],
        [30, 32],
        [54, 32],
        [78, 32],
        [42, 12],
        [66, 12],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="11.5" fill="oklch(0.42 0.07 55)" />
          <circle cx={x} cy={y} r="8" fill="oklch(0.62 0.08 70)" />
          <circle cx={x} cy={y} r="4.5" fill="none" stroke="oklch(0.5 0.08 60)" strokeWidth="1" />
        </g>
      ))}
    </Svg>
  );
}

function Nightstand() {
  return (
    <Svg w={8} vb="0 0 80 92">
      <rect x="0" y="0" width="80" height="6" rx="2" fill={WOOD_LIGHT} />
      <rect x="4" y="6" width="72" height="76" fill={WOOD} />
      <rect x="10" y="14" width="60" height="26" rx="2" fill={WOOD_DARK} opacity="0.4" />
      <rect x="10" y="46" width="60" height="26" rx="2" fill={WOOD_DARK} opacity="0.4" />
      <circle cx="40" cy="27" r="2.5" fill={BRASS} />
      <circle cx="40" cy="59" r="2.5" fill={BRASS} />
      <rect x="8" y="82" width="6" height="10" fill={WOOD_DARK} />
      <rect x="66" y="82" width="6" height="10" fill={WOOD_DARK} />
      <rect x="50" y="-5" width="24" height="5" rx="1" fill="oklch(0.6 0.08 230)" />
      <rect x="52" y="-9" width="20" height="4" rx="1" fill="oklch(0.75 0.08 90)" />
    </Svg>
  );
}

function Banquette({ world }: { world: WorldConfig }) {
  const leather = `color-mix(in oklab, ${world.palette.accent} 30%, oklch(0.35 0.08 25))`;
  return (
    <div className="relative w-full" style={{ height: u(8) }}>
      <div
        className="absolute inset-x-0 top-0 rounded-t-[10px]"
        style={{
          height: u(5),
          background: `repeating-linear-gradient(90deg, ${leather} 0 ${u(3.4)}, color-mix(in oklab, ${leather} 70%, black) ${u(3.6)}, ${leather} ${u(3.8)})`,
          boxShadow: "inset 0 4px 8px rgba(255,255,255,0.08), inset 0 -6px 8px rgba(0,0,0,0.35)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0" style={{ height: u(3), background: WOOD, boxShadow: `inset 0 ${u(0.4)} 0 ${leather}` }} />
    </div>
  );
}

function CafeSign() {
  return (
    <Svg w={22} vb="0 0 220 30">
      <rect x="0" y="0" width="220" height="30" rx="4" fill="oklch(0.3 0.06 160)" />
      <rect x="4" y="4" width="212" height="22" rx="2" fill="none" stroke="oklch(0.75 0.11 80)" strokeWidth="1.2" />
      <text x="110" y="20" textAnchor="middle" fontSize="12" fontFamily="Georgia, serif" letterSpacing="3" fill="oklch(0.85 0.1 82)">
        COFFEE · CAKE · BOOKS
      </text>
    </Svg>
  );
}

function Cushion() {
  return (
    <Svg w={8} vb="0 0 80 16">
      <rect x="0" y="2" width="80" height="14" rx="7" fill="oklch(0.36 0.09 25)" />
      <rect x="4" y="3" width="72" height="5" rx="2.5" fill="oklch(0.46 0.1 28)" opacity="0.7" />
    </Svg>
  );
}

interface PropProps {
  prop: RoomProp;
  world: WorldConfig;
  animate: boolean;
  reducedMotion: boolean;
}

function Prop({ prop, world, animate, reducedMotion }: PropProps) {
  const hanging = HANGING.has(prop.kind);
  const flip = prop.flip ? " scaleX(-1)" : "";
  const style: CSSProperties = {
    left: `${prop.x}%`,
    top: `${prop.y}%`,
    transform: `translate(-50%, ${hanging ? "0" : "-100%"}) scale(${prop.scale ?? 1})${flip}`,
    transformOrigin: hanging ? "top center" : "bottom center",
    width: prop.span ? `${prop.span}%` : undefined,
    height: hanging && prop.drop ? `${prop.drop}%` : undefined,
  };

  let body: ReactNode = null;
  switch (prop.kind) {
    case "bookcase":
    case "shelf":
      body = <Bookcase variant={prop.kind === "shelf" ? "home" : prop.variant} world={world} />;
      break;
    case "bookStack":
    case "stack":
      body = <BookStack variant={prop.variant} />;
      break;
    case "plant":
      body = (
        <div style={{ animation: animate && prop.variant !== "bonsai" ? "ss-sway 8s ease-in-out infinite" : undefined, transformOrigin: "50% 100%" }}>
          <Plant variant={prop.variant} />
        </div>
      );
      break;
    case "bed":
      body = <Bed world={world} animate={animate} withCat={prop.variant === "cat"} />;
      break;
    case "cat":
      body = (
        <div style={{ width: u(6) }}>
          <Cat animate={animate} />
        </div>
      );
      break;
    case "futon":
    case "cushion":
      body = <Cushion />;
      break;
    case "nightstand":
      body = <Nightstand />;
      break;
    case "rug":
      body = <Rug variant={prop.variant} world={world} />;
      break;
    case "counter":
      body = <Counter reducedMotion={!animate} />;
      break;
    case "menuBoard":
      body = <MenuBoard />;
      break;
    case "wallShelf":
      body = <WallShelf variant={prop.variant} />;
      break;
    case "cafeSet":
      body = <CafeSet />;
      break;
    case "banquette":
      body = <Banquette world={world} />;
      break;
    case "sign":
      body = <CafeSign />;
      break;
    case "pendant":
      body = <Pendant variant={prop.variant} animate={animate} />;
      break;
    case "hangingPlant":
      body = <HangingPlant variant={prop.variant} animate={animate} />;
      break;
    case "lantern":
      body = <PaperLantern animate={animate} />;
      break;
    case "tokonoma":
      body = <Tokonoma world={world} />;
      break;
    case "curtains":
      body = <Curtains world={world} animate={animate} />;
      break;
    case "frames":
      body = <Frames />;
      break;
    case "fairyLights":
      body = <FairyLights animate={animate} />;
      break;
    case "skis":
      body = <Skis />;
      break;
    case "hangingLantern":
      body = <HangingLantern animate={animate} />;
      break;
    case "windChime":
      body = <WindChime variant={prop.variant} animate={animate} />;
      break;
    case "leaves":
      body = <Leaves variant={prop.variant} animate={animate} />;
      break;
    case "stoneLantern":
      body = <StoneLantern />;
      break;
    case "armchair":
      body = <Armchair variant={prop.variant} />;
      break;
    case "sideTable":
      body = <SideTable variant={prop.variant} reducedMotion={reducedMotion || !animate} />;
      break;
    case "globe":
      body = <Globe />;
      break;
    case "ladder":
      body = <Ladder />;
      break;
    case "floatingBook":
      body = <FloatingBook variant={prop.variant} animate={animate} />;
      break;
    case "telescope":
      body = <Telescope />;
      break;
    case "orrery":
      body = <Orrery animate={animate} />;
      break;
    case "starChart":
      body = <StarChart variant={prop.variant} />;
      break;
    case "logs":
      body = <Logs />;
      break;
    case "desk":
      body = (
        <Svg w={15} vb="0 0 150 70">
          <rect x="0" y="0" width="150" height="8" rx="2" fill={WOOD} />
          <rect x="6" y="8" width="7" height="62" fill={WOOD_DARK} />
          <rect x="137" y="8" width="7" height="62" fill={WOOD_DARK} />
        </Svg>
      );
      break;
    default:
      body = null;
  }

  return (
    <div
      className={hanging || NO_SHADOW.has(prop.kind) ? "absolute" : "absolute drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]"}
      style={style}
    >
      {body}
    </div>
  );
}

interface Props {
  world: WorldConfig;
  layer?: "back" | "front";
  /** run the props' own small loops (sway, bob, cat) — off for paused previews */
  animate?: boolean;
  reducedMotion?: boolean;
}

function RoomPropsImpl({ world, layer = "back", animate = true, reducedMotion = false }: Props) {
  const props = world.props.filter((p) => (p.layer ?? "back") === layer);
  const live = animate && !reducedMotion;
  return (
    <div className="pointer-events-none absolute inset-0">
      {props.map((prop, i) => (
        <Prop key={`${prop.kind}-${i}`} prop={prop} world={world} animate={live} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
}

export const RoomProps = memo(RoomPropsImpl);
