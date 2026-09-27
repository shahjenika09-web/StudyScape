import type { ReactNode } from "react";

import { StudyScapeProvider, useStudyScape } from "@/state/store";

function MotionShell({ children }: { children: ReactNode }) {
  const { settings } = useStudyScape();
  return (
    <div className={settings.reducedMotion ? "reduced-motion" : undefined}>
      {children}
      {settings.devMode && (
        <div
          role="status"
          className="pointer-events-none fixed left-1/2 top-0 z-[60] -translate-x-1/2 rounded-b-lg border border-t-0 border-[oklch(0.8_0.16_75_/_60%)] bg-[oklch(0.3_0.08_60_/_88%)] px-2.5 py-[3px] font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[oklch(0.92_0.13_85)] shadow-[0_6px_18px_-8px_rgba(0,0,0,0.8)]"
        >
          Dev mode
        </div>
      )}
    </div>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <StudyScapeProvider>
      <MotionShell>{children}</MotionShell>
    </StudyScapeProvider>
  );
}
