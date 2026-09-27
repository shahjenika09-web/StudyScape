/**
 * One scene unit ≈ 1% of a landscape scene's width. It is resolved against the
 * WorldScene container, so furniture, the avatar and the study table keep the
 * same proportions in a full-screen session, a hero banner and a small card.
 * Portrait screens fall back to height so the room doesn't shrink to nothing.
 */
export const SCENE_UNIT = "min(max(1cqw, 0.75cqh), 1.6cqh)";

export const u = (n: number) => `calc(var(--u) * ${n})`;

/**
 * Deterministic 0..1 value from an integer seed. Integer-only maths (mulberry32)
 * so the server and every browser produce bit-identical markup for hydration.
 */
export function seeded(n: number): number {
  let t = (Math.floor(n) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
