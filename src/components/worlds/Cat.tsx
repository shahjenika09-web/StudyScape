import { memo, useEffect, useState } from "react";

type CatPose = "sleep" | "sit" | "stretch";

const FUR = "oklch(0.66 0.12 55)";
const FUR_DARK = "oklch(0.52 0.11 50)";
const BELLY = "oklch(0.86 0.05 75)";

/**
 * A small cat that mostly sleeps. It occasionally sits up to blink and flick
 * its tail, and now and then stretches. Long holds keep it from pulling focus.
 */
function CatImpl({ animate }: { animate: boolean }) {
  const [pose, setPose] = useState<CatPose>("sleep");

  useEffect(() => {
    if (!animate) {
      setPose("sleep");
      return;
    }
    let timer = 0;
    const hold = (min: number, max: number) => (min + Math.random() * (max - min)) * 1000;
    const next = (current: CatPose) => {
      if (current === "sleep") {
        timer = window.setTimeout(() => {
          setPose("sit");
          next("sit");
        }, hold(45, 90));
      } else if (current === "sit") {
        timer = window.setTimeout(() => {
          const stretch = Math.random() < 0.35;
          setPose(stretch ? "stretch" : "sleep");
          next(stretch ? "stretch" : "sleep");
        }, hold(20, 40));
      } else {
        timer = window.setTimeout(() => {
          setPose("sit");
          next("sit");
        }, 3200);
      }
    };
    next("sleep");
    return () => window.clearTimeout(timer);
  }, [animate]);

  return (
    <svg viewBox="0 0 60 36" width="100%" style={{ display: "block", overflow: "visible" }} aria-hidden="true">
      {pose === "sleep" && (
        <g style={{ animation: animate ? "ss-breathe 4.2s ease-in-out infinite" : undefined, transformOrigin: "30px 34px" }}>
          <path d="M46 29 C54 33 34 37 14 33" stroke={FUR_DARK} strokeWidth="4" strokeLinecap="round" fill="none" />
          <ellipse cx="31" cy="26" rx="18" ry="9" fill={FUR} />
          <path d="M20 22 C26 18 36 18 42 21" stroke={FUR_DARK} strokeWidth="1.4" fill="none" opacity="0.6" />
          <path d="M28 19 L30 24 M34 18.5 L35 23.5" stroke={FUR_DARK} strokeWidth="1.2" opacity="0.6" />
          <circle cx="15" cy="26" r="7" fill={FUR} />
          <path d="M10 21 L10.5 15 L15 19.5Z M16 19 L19.5 14.5 L20.5 20.5Z" fill={FUR} />
          <path d="M11.5 26.5 q2 1.5 4 0" stroke="oklch(0.3 0.04 40)" strokeWidth="1" fill="none" strokeLinecap="round" />
          <ellipse cx="15" cy="30" rx="3.5" ry="1.8" fill={BELLY} />
          {animate && (
            <text
              x="20"
              y="12"
              fontSize="7"
              fill="oklch(0.95 0.02 90 / 0.7)"
              style={{ animation: "ss-zzz 6s ease-out 2s infinite", transformBox: "fill-box", opacity: 0 }}
            >
              z
            </text>
          )}
        </g>
      )}

      {pose === "sit" && (
        <g>
          <g style={{ animation: animate ? "ss-tail 3.4s ease-in-out infinite" : undefined, transformOrigin: "22px 32px" }}>
            <path d="M22 32 C12 33 8 24 12 16" stroke={FUR_DARK} strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
          <path d="M20 34 C16 22 20 12 31 12 C42 12 45 24 43 34Z" fill={FUR} />
          <path d="M27 20 C31 18 35 18 38 20" stroke={FUR_DARK} strokeWidth="1.3" fill="none" opacity="0.6" />
          <ellipse cx="38" cy="30" rx="5" ry="4" fill={BELLY} />
          <circle cx="38" cy="10" r="7.5" fill={FUR} />
          <path d="M32.5 6 L33 -1 L37.5 4Z M39.5 3.5 L44 -1 L44 6Z" fill={FUR} />
          <path d="M34 2 L34.5 -0.2 M41.8 1.5 L42.8 0" stroke="oklch(0.8 0.08 20)" strokeWidth="1" />
          <g style={{ animation: animate ? "ss-blink 5s ease-in-out infinite" : undefined, transformBox: "fill-box", transformOrigin: "center" }}>
            <ellipse cx="41" cy="9" rx="1.2" ry="1.6" fill="oklch(0.3 0.06 140)" />
          </g>
          <circle cx="45" cy="12" r="0.9" fill="oklch(0.6 0.1 20)" />
        </g>
      )}

      {pose === "stretch" && (
        <g style={{ animation: "ss-cat-stretch 3.2s ease-in-out both", transformOrigin: "30px 34px" }}>
          <path d="M12 26 C4 22 4 14 8 10" stroke={FUR_DARK} strokeWidth="3.6" strokeLinecap="round" fill="none" />
          <path d="M12 30 C12 20 18 18 30 24 C38 28 44 30 50 30 L50 34 L12 34Z" fill={FUR} />
          <path d="M44 33 L56 33" stroke={FUR} strokeWidth="3.4" strokeLinecap="round" />
          <circle cx="50" cy="26" r="6.5" fill={FUR} />
          <path d="M46 21 L46 15 L50 19Z M51 19 L55 15 L55.5 21Z" fill={FUR} />
          <path d="M51 26 q1.5 1 3 0" stroke="oklch(0.3 0.04 40)" strokeWidth="1" fill="none" />
        </g>
      )}
    </svg>
  );
}

export const Cat = memo(CatImpl);
