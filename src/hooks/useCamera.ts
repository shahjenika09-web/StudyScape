import { useEffect, useState } from "react";

export type CameraShot = "wide" | "medium" | "desk" | "side" | "environment" | "detail";

export interface CameraFrame {
  scale: number;
  x: number;
  y: number;
  rotate: number;
  label: string;
}

export const CAMERA_SHOTS: Record<CameraShot, CameraFrame> = {
  wide: { scale: 1, x: 0, y: 0, rotate: 0, label: "Wide environment" },
  medium: { scale: 1.18, x: -4, y: -3, rotate: 0, label: "Medium character" },
  desk: { scale: 1.32, x: -8, y: -8, rotate: 0.4, label: "Desk / workspace" },
  side: { scale: 1.12, x: 7, y: -2, rotate: -0.6, label: "Side angle" },
  environment: { scale: 1.06, x: 3, y: 3, rotate: 0, label: "Environmental" },
  detail: { scale: 1.45, x: -3, y: -11, rotate: 0, label: "Detail close-up" },
};

const ROTATION: CameraShot[] = ["wide", "medium", "environment", "desk", "side", "wide", "detail"];

/** Occasional, slow cinematic shot changes. Never continuous movement. */
export function useCamera(options: {
  enabled: boolean;
  reducedMotion: boolean;
  forced?: CameraShot | null;
}): { shot: CameraShot; frame: CameraFrame; setShot: (s: CameraShot) => void } {
  const { enabled, reducedMotion, forced } = options;
  const [shot, setShot] = useState<CameraShot>("wide");

  useEffect(() => {
    if (forced) {
      setShot(forced);
      return;
    }
    if (!enabled || reducedMotion) {
      setShot("wide");
      return;
    }
    let index = 0;
    const id = window.setInterval(
      () => {
        index = (index + 1) % ROTATION.length;
        setShot(ROTATION[index]!);
      },
      42_000 + Math.random() * 20_000,
    );
    return () => window.clearInterval(id);
  }, [enabled, reducedMotion, forced]);

  return { shot, frame: CAMERA_SHOTS[shot], setShot };
}
