import type { ReactNode } from "react";

import { ActionButton } from "@/components/ui/primitives";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { FocusTimer } from "@/hooks/useFocusTimer";

export type PanelKey = "atmosphere" | "tasks" | "notes" | "stats" | "audio" | "worlds" | "developer";

const DOCK: { key: PanelKey; label: string; icon: ReactNode }[] = [
  {
    key: "atmosphere",
    label: "Atmosphere",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M13 3l-1.5 1.5M4.5 11.5L3 13" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "tasks",
    label: "Tasks",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2 4.5l2 2 3-3M2 11.5l2 2 3-3M9.5 4.5H14M9.5 11.5H14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "notes",
    label: "Notes",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 2h10v12H3z" /><path d="M5.5 5.5h5M5.5 8.5h5M5.5 11.5h3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "stats",
    label: "Stats",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2.5 13.5V8M8 13.5V3M13.5 13.5V6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "audio",
    label: "Ambience",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 6.5h2.5L9 3.5v9L5.5 9.5H3z" strokeLinejoin="round" />
        <path d="M11.5 6a3 3 0 0 1 0 4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "worlds",
    label: "Worlds",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="8" cy="8" r="6" /><path d="M2 8h12M8 2c2 2.4 2 9.6 0 12M8 2C6 4.4 6 11.6 8 14" />
      </svg>
    ),
  },
];

export function FocusHud({
  timer,
  worldName,
  avatarLabel,
  cameraLabel,
  activePanel,
  onPanel,
  onEnd,
  onExit,
  devMode,
}: {
  timer: FocusTimer;
  worldName: string;
  avatarLabel: string;
  cameraLabel: string;
  activePanel: PanelKey | null;
  onPanel: (p: PanelKey | null) => void;
  onEnd: () => void;
  onExit: () => void;
  devMode: boolean;
}) {
  const dock = devMode
    ? [...DOCK, { key: "developer" as PanelKey, label: "Developer", icon: <span className="text-[11px] font-bold">{"{}"}</span> }]
    : DOCK;

  return (
    <>
      {/* top bar */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 sm:p-6">
        <div className="pointer-events-auto glass-soft flex items-center gap-3 rounded-full py-2 pl-3 pr-4">
          <button
            type="button"
            onClick={onExit}
            aria-label="Leave the world"
            className="grid h-7 w-7 place-items-center rounded-full border border-[var(--hairline)] text-muted-foreground transition hover:text-foreground"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M7.5 2L3.5 6l4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="leading-tight">
            <p className="text-[12px] font-semibold text-foreground">{worldName}</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{avatarLabel}</p>
          </div>
        </div>

        {activePanel === null && (
          <div className="pointer-events-auto glass-soft hidden rounded-full px-3.5 py-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:block">
            {cameraLabel}
          </div>
        )}
      </header>

      {/* bottom HUD */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 p-4 sm:p-6">
        <div className="pointer-events-auto glass-panel flex w-full max-w-xl flex-col gap-3 rounded-[26px] px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="relative grid h-12 w-12 shrink-0 place-items-center">
              <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
                <circle cx="22" cy="22" r="19" fill="none" stroke="oklch(1 0 0 / 10%)" strokeWidth="3" />
                <circle
                  cx="22"
                  cy="22"
                  r="19"
                  fill="none"
                  stroke="var(--ember)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 19}
                  strokeDashoffset={2 * Math.PI * 19 * (1 - timer.progress)}
                  style={{ transition: "stroke-dashoffset 300ms linear" }}
                />
              </svg>
              <span className="text-[9px] font-semibold tabular-nums text-muted-foreground">
                {Math.round(timer.progress * 100)}%
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-display text-2xl leading-none tabular-nums text-foreground sm:text-[28px]">
                {formatClock(timer.remaining)}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {timer.status === "running" ? "Focusing" : timer.status === "paused" ? "Paused" : timer.status === "complete" ? "Session complete" : "Ready"}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {timer.status === "running" ? (
                <ActionButton variant="ghost" onClick={timer.pause} className="px-4 sm:px-5">
                  Pause
                </ActionButton>
              ) : timer.status === "paused" ? (
                <ActionButton onClick={timer.resume} className="px-4 sm:px-5">Resume</ActionButton>
              ) : timer.status === "idle" ? (
                <ActionButton onClick={() => timer.start(timer.duration / 60)}>Start</ActionButton>
              ) : null}
              {(timer.status === "running" || timer.status === "paused") && (
                <ActionButton
                  variant="ghost"
                  onClick={timer.reset}
                  className="px-3"
                  aria-label="Reset timer to the full session length"
                  title="Reset timer"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2.5 7a4.5 4.5 0 1 0 1.4-3.3" strokeLinecap="round" />
                    <path d="M2.2 1.8v2.6h2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="hidden sm:inline">Reset</span>
                </ActionButton>
              )}
              <ActionButton variant="ghost" onClick={onEnd} className="px-4">
                End
              </ActionButton>
            </div>
          </div>

          <nav className="flex items-center justify-between gap-1 border-t border-[var(--hairline)] pt-2" aria-label="Session panels">
            {dock.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => onPanel(activePanel === d.key ? null : d.key)}
                aria-pressed={activePanel === d.key}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[9px] uppercase tracking-wider transition",
                  activePanel === d.key
                    ? "bg-white/[0.08] text-foreground"
                    : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground",
                )}
              >
                {d.icon}
                <span className="hidden sm:block">{d.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
