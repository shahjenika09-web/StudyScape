import { useEffect, useState } from "react";

/**
 * Occasional lightning. Returns a 0..1 flash value that both the outdoor sky
 * and the room lighting can respond to.
 */
export function useLightning(active: boolean, reducedMotion: boolean): number {
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    if (!active || reducedMotion) {
      setFlash(0);
      return;
    }
    let timeout: number;
    let alive = true;

    const strike = () => {
      if (!alive) return;
      const sequence = [1, 0.15, 0.8, 0];
      sequence.forEach((v, i) => {
        window.setTimeout(() => alive && setFlash(v), i * 90);
      });
      timeout = window.setTimeout(strike, 9000 + Math.random() * 16000);
    };

    timeout = window.setTimeout(strike, 4000 + Math.random() * 9000);
    return () => {
      alive = false;
      window.clearTimeout(timeout);
    };
  }, [active, reducedMotion]);

  return flash;
}
