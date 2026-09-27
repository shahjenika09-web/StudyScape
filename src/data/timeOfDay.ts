import type { TimeOfDay } from "./types";

export interface SkyPalette {
  id: TimeOfDay;
  label: string;
  /** sky gradient stops, top -> horizon */
  sky: [string, string, string];
  /** distant scenery silhouette colour */
  far: string;
  near: string;
  /** light that spills into the room through openings */
  spill: string;
  /** interior ambient darkening, 0 = bright day, 1 = deep night */
  darkness: number;
  sun: { x: number; y: number; color: string; size: number } | null;
  stars: number;
}

export const TIMES_OF_DAY: SkyPalette[] = [
  {
    id: "sunrise",
    label: "Sunrise",
    sky: ["oklch(0.55 0.13 265)", "oklch(0.72 0.13 40)", "oklch(0.86 0.11 70)"],
    far: "oklch(0.42 0.06 280)",
    near: "oklch(0.3 0.05 275)",
    spill: "oklch(0.85 0.12 60)",
    darkness: 0.34,
    sun: { x: 30, y: 74, color: "oklch(0.92 0.12 78)", size: 26 },
    stars: 0.1,
  },
  {
    id: "morning",
    label: "Morning",
    sky: ["oklch(0.68 0.11 240)", "oklch(0.82 0.07 230)", "oklch(0.93 0.04 220)"],
    far: "oklch(0.55 0.05 230)",
    near: "oklch(0.4 0.05 210)",
    spill: "oklch(0.94 0.05 220)",
    darkness: 0.12,
    sun: { x: 68, y: 26, color: "oklch(0.97 0.07 95)", size: 18 },
    stars: 0,
  },
  {
    id: "afternoon",
    label: "Afternoon",
    sky: ["oklch(0.62 0.13 245)", "oklch(0.78 0.09 235)", "oklch(0.9 0.05 225)"],
    far: "oklch(0.52 0.06 225)",
    near: "oklch(0.38 0.05 215)",
    spill: "oklch(0.95 0.04 230)",
    darkness: 0.08,
    sun: { x: 50, y: 14, color: "oklch(0.98 0.05 100)", size: 16 },
    stars: 0,
  },
  {
    id: "golden",
    label: "Golden Hour",
    sky: ["oklch(0.56 0.12 60)", "oklch(0.74 0.13 55)", "oklch(0.87 0.12 72)"],
    far: "oklch(0.42 0.07 45)",
    near: "oklch(0.3 0.06 40)",
    spill: "oklch(0.88 0.13 65)",
    darkness: 0.22,
    sun: { x: 74, y: 62, color: "oklch(0.9 0.14 70)", size: 24 },
    stars: 0,
  },
  {
    id: "sunset",
    label: "Sunset",
    sky: ["oklch(0.38 0.11 295)", "oklch(0.58 0.15 25)", "oklch(0.76 0.14 45)"],
    far: "oklch(0.32 0.07 310)",
    near: "oklch(0.22 0.05 300)",
    spill: "oklch(0.78 0.14 35)",
    darkness: 0.4,
    sun: { x: 24, y: 76, color: "oklch(0.82 0.16 45)", size: 28 },
    stars: 0.15,
  },
  {
    id: "night",
    label: "Night",
    sky: ["oklch(0.18 0.06 280)", "oklch(0.27 0.07 270)", "oklch(0.36 0.06 260)"],
    far: "oklch(0.22 0.04 275)",
    near: "oklch(0.14 0.03 275)",
    spill: "oklch(0.6 0.08 265)",
    darkness: 0.66,
    sun: { x: 72, y: 22, color: "oklch(0.95 0.02 250)", size: 12 },
    stars: 0.8,
  },
  {
    id: "midnight",
    label: "Midnight",
    sky: ["oklch(0.11 0.04 285)", "oklch(0.16 0.05 278)", "oklch(0.22 0.05 268)"],
    far: "oklch(0.15 0.03 280)",
    near: "oklch(0.09 0.02 280)",
    spill: "oklch(0.45 0.07 268)",
    darkness: 0.82,
    sun: { x: 40, y: 18, color: "oklch(0.9 0.02 250)", size: 9 },
    stars: 1,
  },
];

export const getSky = (id: TimeOfDay): SkyPalette =>
  TIMES_OF_DAY.find((t) => t.id === id) ?? TIMES_OF_DAY[2]!;
