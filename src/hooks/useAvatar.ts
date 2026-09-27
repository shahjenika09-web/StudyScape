import { useEffect, useRef, useState } from "react";

import {
  AVATAR_ANIMATIONS,
  BREAK_STATES,
  FOCUS_STATES,
  type AvatarAnimation,
  type AvatarState,
} from "@/data/animations";

function pickWeighted(pool: AvatarAnimation[], exclude?: AvatarState): AvatarAnimation {
  const candidates = pool.filter((a) => a.id !== exclude);
  const list = candidates.length ? candidates : pool;
  const total = list.reduce((sum, a) => sum + a.weight, 0);
  let roll = Math.random() * total;
  for (const a of list) {
    roll -= a.weight;
    if (roll <= 0) return a;
  }
  return list[0]!;
}

/**
 * Drives the avatar between calm, loopable states. States hold for a while,
 * so the character is never in constant motion.
 */
export function useAvatar(options: {
  active: boolean;
  onBreak: boolean;
  reducedMotion: boolean;
  forced?: AvatarState | null;
  /** the world has a drink on the table, so sipping is a natural idle */
  canSip?: boolean;
}): { state: AvatarState; animation: AvatarAnimation } {
  const { active, onBreak, reducedMotion, forced, canSip = false } = options;
  const [state, setState] = useState<AvatarState>("studying");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (forced) {
      setState(forced);
      return;
    }
    if (!active) return;

    let cancelled = false;
    const schedule = (current: AvatarState) => {
      const anim = AVATAR_ANIMATIONS[current];
      const [min, max] = anim.duration;
      const hold = (reducedMotion ? max * 1.8 : min + Math.random() * (max - min)) * 1000;
      timeoutRef.current = window.setTimeout(() => {
        if (cancelled) return;
        const pool = (onBreak ? BREAK_STATES : FOCUS_STATES).filter((a) => canSip || !a.needsDrink);
        const next = pickWeighted(pool, current);
        setState(next.id);
        schedule(next.id);
      }, hold);
    };

    const initial = onBreak ? "relaxing" : "studying";
    setState(initial);
    schedule(initial);

    return () => {
      cancelled = true;
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [active, onBreak, reducedMotion, forced, canSip]);

  return { state, animation: AVATAR_ANIMATIONS[state] };
}
