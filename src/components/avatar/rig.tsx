import type { ReactNode } from "react";

import { RIG_WIDTH } from "@/components/avatar/rigGeometry";
import type { WorldConfig } from "@/data/types";
import { u } from "@/components/worlds/units";

/** positions the shared study-spot frame at the world's avatar anchor */
export function RigFrame({ world, children }: { world: WorldConfig; children: ReactNode }) {
  const a = world.avatar;
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${a.x}%`,
        top: `${a.y}%`,
        width: u(RIG_WIDTH),
        transform: `translate(-50%, -100%) scaleX(${a.facing}) scale(${a.scale})`,
        transformOrigin: "bottom center",
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 180" overflow="visible" style={{ display: "block", width: "100%", height: "auto" }}>
        {children}
      </svg>
    </div>
  );
}
