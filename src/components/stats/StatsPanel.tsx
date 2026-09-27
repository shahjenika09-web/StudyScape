import { Meter, PanelHeader, SectionLabel } from "@/components/ui/primitives";
import { WORLDS, getWorld } from "@/data/worlds";
import { formatDuration } from "@/lib/format";
import { useStudyScape } from "@/state/store";

export function StatsPanel({ onClose }: { onClose?: () => void }) {
  const { progress, unlockProgress, isUnlocked } = useStudyScape();

  const worldTotals = Object.entries(progress.worldSeconds).sort((a, b) => b[1] - a[1]);
  const maxWorld = worldTotals[0]?.[1] ?? 1;

  const cards = [
    { label: "Total focus", value: formatDuration(progress.totalSeconds) },
    { label: "Today", value: formatDuration(progress.todaySeconds) },
    { label: "Sessions", value: String(progress.sessions.length) },
    { label: "Longest", value: formatDuration(progress.longestSeconds) },
  ];

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Stats" subtitle="Where your hours have gone" {...(onClose ? { onClose } : {})} />

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <div className="grid grid-cols-2 gap-2">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-[var(--hairline)] bg-white/[0.03] px-3.5 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{c.label}</p>
              <p className="mt-1 font-display text-xl text-foreground">{c.value}</p>
            </div>
          ))}
        </div>

        <section>
          <SectionLabel>Time per world</SectionLabel>
          {worldTotals.length === 0 && (
            <p className="text-[12px] text-muted-foreground">No sessions recorded yet.</p>
          )}
          <div className="space-y-3">
            {worldTotals.map(([id, seconds]) => (
              <div key={id}>
                <div className="mb-1 flex justify-between text-[12px]">
                  <span className="text-foreground">{getWorld(id).name}</span>
                  <span className="tabular-nums text-muted-foreground">{formatDuration(seconds)}</span>
                </div>
                <Meter value={seconds / maxWorld} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>World unlocks</SectionLabel>
          <div className="space-y-3">
            {WORLDS.map((w) => {
              const p = unlockProgress(w.id);
              const unlocked = isUnlocked(w.id);
              return (
                <div key={w.id}>
                  <div className="mb-1 flex justify-between text-[12px]">
                    <span className="text-foreground">{w.name}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {unlocked ? "Unlocked" : `${p.hours.toFixed(1)} / ${p.required} h`}
                    </span>
                  </div>
                  <Meter value={unlocked ? 1 : p.ratio} />
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <SectionLabel>Recent sessions</SectionLabel>
          <div className="space-y-1.5">
            {progress.sessions.slice(0, 8).map((s) => (
              <div key={s.id} className="flex justify-between text-[12px]">
                <span className="text-muted-foreground">{getWorld(s.worldId).name}</span>
                <span className="tabular-nums text-foreground/80">{formatDuration(s.seconds)}</span>
              </div>
            ))}
            {progress.sessions.length === 0 && (
              <p className="text-[12px] text-muted-foreground">Your finished sessions will appear here.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
