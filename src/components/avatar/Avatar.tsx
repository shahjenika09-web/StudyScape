import { memo, type ReactNode } from "react";

import { RigFrame } from "@/components/avatar/rig";
import { FLOOR_DROP, TABLE_TOP } from "@/components/avatar/rigGeometry";
import type { AvatarAnimation } from "@/data/animations";
import type { DeskItem, OutfitId, WorldConfig } from "@/data/types";

interface Props {
  world: WorldConfig;
  animation: AvatarAnimation;
  reducedMotion: boolean;
}

const MOTION_CSS: Record<AvatarAnimation["motion"], { name: string; duration: number }> = {
  lean: { name: "ss-lean", duration: 6.5 },
  write: { name: "ss-write", duration: 3.2 },
  type: { name: "ss-type", duration: 1.6 },
  tilt: { name: "ss-tilt", duration: 5.5 },
  scan: { name: "ss-scan", duration: 7 },
  slump: { name: "ss-slump", duration: 5 },
  stretch: { name: "ss-stretch", duration: 4 },
  rest: { name: "ss-rest", duration: 7.5 },
  idle: { name: "ss-breathe", duration: 5 },
  sip: { name: "ss-breathe", duration: 4 },
};

interface Outfit {
  top: string;
  shade: string;
  pants: string;
  shoe: string;
}

const OUTFITS: Record<OutfitId, Outfit> = {
  kimono: { top: "oklch(0.4 0.08 255)", shade: "oklch(0.32 0.07 255)", pants: "oklch(0.33 0.06 255)", shoe: "oklch(0.92 0.01 90)" },
  cloak: { top: "oklch(0.38 0.1 22)", shade: "oklch(0.3 0.08 20)", pants: "oklch(0.26 0.03 40)", shoe: "oklch(0.24 0.03 40)" },
  cardigan: { top: "oklch(0.76 0.05 80)", shade: "oklch(0.66 0.05 75)", pants: "oklch(0.36 0.05 250)", shoe: "oklch(0.3 0.03 40)" },
  hoodie: { top: "oklch(0.7 0.07 350)", shade: "oklch(0.61 0.07 350)", pants: "oklch(0.38 0.03 290)", shoe: "oklch(0.9 0.01 90)" },
  winter: { top: "oklch(0.5 0.14 28)", shade: "oklch(0.42 0.13 27)", pants: "oklch(0.3 0.03 60)", shoe: "oklch(0.36 0.05 55)" },
  coat: { top: "oklch(0.36 0.06 260)", shade: "oklch(0.3 0.05 260)", pants: "oklch(0.26 0.02 260)", shoe: "oklch(0.22 0.02 40)" },
  flannel: { top: "oklch(0.48 0.1 145)", shade: "oklch(0.4 0.09 145)", pants: "oklch(0.4 0.04 70)", shoe: "oklch(0.34 0.05 55)" },
  light: { top: "oklch(0.88 0.04 20)", shade: "oklch(0.8 0.05 20)", pants: "oklch(0.42 0.04 260)", shoe: "oklch(0.9 0.02 30)" },
};

const SKIN = "oklch(0.8 0.05 60)";
const HAIR = "oklch(0.3 0.04 40)";
const TORSO = "M52 132 C52 104 60 90 74 90 C88 90 96 104 96 132 Z";

/** clothing details layered over the torso */
function OutfitDetail({ id, o }: { id: OutfitId; o: Outfit }): ReactNode {
  switch (id) {
    case "kimono":
      return (
        <>
          <path d="M79 91 L93 118" stroke="oklch(0.93 0.01 90)" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M73 91 L90 121" stroke={o.shade} strokeWidth="2" />
          <rect x="53" y="117" width="43" height="8" rx="2" fill="oklch(0.62 0.12 40)" />
        </>
      );
    case "cloak":
      return (
        <>
          <path d="M54 96 C50 86 58 80 68 86 L66 106 C60 104 56 101 54 96Z" fill={o.shade} />
          <path d="M88 94 L94 130" stroke="oklch(0.72 0.12 80)" strokeWidth="1.6" />
          <circle cx="86" cy="97" r="2.4" fill="oklch(0.8 0.13 85)" />
        </>
      );
    case "cardigan":
      return (
        <>
          <path d="M84 92 C90 100 93 114 94 131 L88 131 C88 116 86 102 82 93Z" fill="oklch(0.36 0.04 250)" />
          {[104, 113, 122].map((y) => (
            <circle key={y} cx={86 + (y - 104) * 0.12} cy={y} r="1.2" fill="oklch(0.5 0.04 60)" />
          ))}
        </>
      );
    case "hoodie":
      return (
        <>
          <path d="M55 98 C50 86 58 76 68 82 L68 104 C62 104 57 102 55 98Z" fill={o.shade} />
          <path d="M84 96 L86 110 M88 95 L90 108" stroke="oklch(0.95 0.01 90)" strokeWidth="1" strokeLinecap="round" />
          <path d="M66 118 L90 118 L92 128 L64 128Z" fill={o.shade} opacity="0.8" />
        </>
      );
    case "winter":
      return (
        <>
          {/* cable knit */}
          {[62, 72, 82].map((x) => (
            <path key={x} d={`M${x} 98 q3 5 0 10 q-3 5 0 10 q3 5 0 10`} stroke={o.shade} strokeWidth="1.6" fill="none" />
          ))}
          {/* scarf */}
          <path d="M60 90 C66 97 84 97 90 89 L91 96 C84 102 66 103 59 96Z" fill="oklch(0.76 0.13 85)" />
          <path d="M84 96 L92 96 L95 120 L87 121Z" fill="oklch(0.72 0.13 82)" />
          <path d="M88 101 L93 101 M88.6 107 L93.6 107 M89.2 113 L94.2 113" stroke="oklch(0.55 0.13 30)" strokeWidth="1.4" />
          <path d="M87.5 121 l-0.5 3 M90 121 l0 3 M92.5 120.7 l0.5 3" stroke="oklch(0.72 0.13 82)" strokeWidth="1" />
        </>
      );
    case "coat":
      return (
        <>
          <path d="M64 88 L74 100 L84 88 L88 94 L76 106 L60 94Z" fill={o.shade} />
          {[106, 116, 126].map((y) => (
            <circle key={y} cx="88" cy={y} r="1.5" fill="oklch(0.75 0.1 80)" />
          ))}
        </>
      );
    case "flannel":
      return (
        <g opacity="0.55" stroke="oklch(0.28 0.06 150)" strokeWidth="1.3">
          {[100, 110, 120].map((y) => (
            <path key={y} d={`M52 ${y} H96`} />
          ))}
          {[62, 72, 82, 90].map((x) => (
            <path key={x} d={`M${x} 92 V132`} />
          ))}
        </g>
      );
    case "light":
    default:
      return <path d="M68 90 Q76 98 84 90" stroke={o.shade} strokeWidth="2" fill="none" />;
  }
}

const DRINKS: DeskItem[] = ["coffee", "tea", "cocoa", "mug"];

function HeldCup({ drink }: { drink: DeskItem }) {
  if (drink === "tea") {
    return (
      <g>
        <path d="M86 82 L98 82 L96 95 L88 95Z" fill="oklch(0.62 0.06 150)" />
        <path d="M86 85 L98 85" stroke="oklch(0.48 0.06 150)" strokeWidth="1" />
      </g>
    );
  }
  const body = drink === "coffee" ? "oklch(0.95 0.01 90)" : drink === "cocoa" ? "oklch(0.55 0.12 30)" : "oklch(0.68 0.08 230)";
  return (
    <g>
      <rect x="85" y="81" width="13" height="14" rx="2.5" fill={body} />
      <path d="M98 84 q5 3 0 7" stroke={body} strokeWidth="2" fill="none" />
    </g>
  );
}

/**
 * The character at the study spot. One SVG rig, many calm loopable states —
 * adding a new state only needs an entry in data/animations.ts plus a keyframe.
 * Seat and table are drawn by StudySpot in the same frame.
 */
function AvatarImpl({ world, animation, reducedMotion }: Props) {
  const motion = MOTION_CSS[animation.motion];
  const bodyAnim = reducedMotion ? undefined : `${motion.name} ${motion.duration}s ease-in-out infinite`;
  const accent = world.palette.accent;
  const o = OUTFITS[world.avatar.outfit];
  const floor = world.avatar.seat === "cushion";
  const drop = floor ? FLOOR_DROP : 0;
  // hands rest just above the table surface, in body-local coordinates
  const handY = TABLE_TOP[world.avatar.table] - drop - 3;
  const drink = world.avatar.items.find((i) => DRINKS.includes(i)) ?? "mug";
  const sipping = animation.motion === "sip";
  const winter = world.avatar.outfit === "winter";

  return (
    <RigFrame world={world}>
      <g transform={drop ? `translate(0 ${drop})` : undefined} className="drop-shadow-[0_14px_18px_rgba(0,0,0,0.45)]">
        {/* legs */}
        {floor ? (
          <g>
            <path d="M58 127 L99 129" stroke={o.pants} strokeWidth="15" strokeLinecap="round" />
            <path d="M96 138 L60 139" stroke={o.pants} strokeWidth="10" strokeLinecap="round" opacity="0.9" />
            <ellipse cx="56" cy="141" rx="6" ry="3.5" fill={o.shoe} />
          </g>
        ) : (
          <g>
            <path d="M56 124 L100 123" stroke={o.pants} strokeWidth="14" strokeLinecap="round" />
            <path d="M101 125 L104 167" stroke={o.pants} strokeWidth="10.5" strokeLinecap="round" />
            <ellipse cx="110" cy="171" rx="9" ry="4.2" fill={o.shoe} />
          </g>
        )}

        {/* body group carries the state motion */}
        <g style={{ animation: bodyAnim, transformOrigin: "72px 150px" }}>
          <path d={TORSO} fill={o.top} />
          <path d="M60 132 C60 112 66 100 74 100 C82 100 88 112 88 132 Z" fill={o.shade} opacity="0.35" />
          <OutfitDetail id={world.avatar.outfit} o={o} />

          {/* far arm resting on the table */}
          <path
            d={`M90 108 C104 110 116 ${handY - 2} 122 ${handY}`}
            stroke={o.shade}
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />

          {sipping ? (
            /* near arm brings the cup up */
            <g>
              <path d="M84 106 L96 120 L91 95" stroke={o.top} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <g
                style={{
                  animation: reducedMotion ? undefined : "ss-sip 4.5s ease-in-out infinite",
                  transformOrigin: "91px 94px",
                }}
              >
                <HeldCup drink={drink} />
                <circle cx="91" cy="94" r="5.5" fill={SKIN} />
              </g>
            </g>
          ) : (
            /* writing / typing hand */
            <g
              style={{
                animation:
                  reducedMotion || !(animation.motion === "write" || animation.motion === "type")
                    ? undefined
                    : `${animation.motion === "write" ? "ss-hand-write 2.6s" : "ss-type 0.9s"} ease-in-out infinite`,
                transformOrigin: `108px ${handY - 2}px`,
              }}
            >
              <path
                d={`M86 112 C98 116 108 ${handY - 5} 114 ${handY - 1}`}
                stroke={o.top}
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="116" cy={handY} r="6" fill={SKIN} />
              {animation.penVisible && (
                <rect x="118" y={handY - 15} width="3" height="18" rx="1.5" transform={`rotate(24 118 ${handY - 15})`} fill={accent} />
              )}
            </g>
          )}

          {/* head */}
          <g style={{ transformOrigin: "74px 92px" }}>
            <circle cx="74" cy="76" r="17" fill={SKIN} />
            <path d="M57 74 C57 60 74 54 90 62 C94 64 92 74 91 76 C86 66 68 64 57 74Z" fill={HAIR} />
            {world.avatar.outfit === "cloak" || world.avatar.outfit === "kimono" ? (
              <circle cx="61" cy="66" r="6" fill={HAIR} />
            ) : null}
            <g
              style={{
                animation: reducedMotion ? undefined : "ss-blink 6.5s ease-in-out infinite",
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
            >
              <circle cx="82" cy="79" r="1.8" fill="oklch(0.22 0.03 40)" />
            </g>
            <circle cx="84" cy="84" r="2.6" fill="oklch(0.72 0.1 25)" opacity="0.35" />
            <path d="M86 86 q-5 3 -9 0" stroke="oklch(0.35 0.05 30)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            {winter && (
              <g>
                <path d="M56 70 C56 52 92 50 92 68 Z" fill="oklch(0.88 0.03 85)" />
                <rect x="55" y="64" width="38" height="7" rx="3.5" fill="oklch(0.5 0.14 28)" />
                <circle cx="73" cy="51" r="4.5" fill="oklch(0.9 0.03 85)" />
              </g>
            )}
          </g>
        </g>

        {/* thought mark */}
        {animation.thought && (
          <g opacity="0.75" style={{ animation: reducedMotion ? undefined : "ss-float 4s ease-in-out infinite" }}>
            <circle cx="100" cy="50" r="12" fill="oklch(0.95 0.01 300 / 12%)" />
            <text
              x="100"
              y="55"
              textAnchor="middle"
              fontSize="13"
              fill="oklch(0.95 0.01 300 / 80%)"
              transform={world.avatar.facing === -1 ? "scale(-1 1) translate(-200 0)" : undefined}
            >
              {animation.thought}
            </text>
          </g>
        )}
      </g>
    </RigFrame>
  );
}

export const Avatar = memo(AvatarImpl);
