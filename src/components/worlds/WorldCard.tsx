import { Meter } from "@/components/ui/primitives";
import { WorldScene } from "@/components/worlds/WorldScene";
import type { WorldConfig } from "@/data/types";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useStudyScape } from "@/state/store";

export function WorldCard({
  world,
  active,
  onSelect,
  compact = false,
}: {
  world: WorldConfig;
  active?: boolean;
  onSelect: (id: string) => void;
  compact?: boolean;
}) {
  const { atmosphereFor, isUnlocked, unlockProgress } = useStudyScape();
  const reducedMotion = useReducedMotion();
  const atmo = atmosphereFor(world.id);
  const unlocked = isUnlocked(world.id);
  const p = unlockProgress(world.id);

  return (
    <button
      type="button"
      onClick={() => unlocked && onSelect(world.id)}
      disabled={!unlocked}
      aria-label={unlocked ? `Select ${world.name}` : `${world.name} locked`}
      className={cn(
        "group relative w-full overflow-hidden rounded-3xl border text-left transition-all duration-500",
        active
          ? "border-[color-mix(in_oklab,var(--primary)_60%,transparent)] shadow-[0_18px_44px_-22px_color-mix(in_oklab,var(--ember)_70%,transparent)]"
          : "border-[var(--hairline)] hover:border-white/25",
        !unlocked && "cursor-not-allowed",
      )}
    >
      <div className={cn("relative w-full", compact ? "aspect-[16/9]" : "aspect-[4/3]")}>
        <WorldScene
          className="absolute inset-0 overflow-hidden"
          world={world}
          time={atmo.time}
          weather={atmo.weather}
          features={atmo.features}
          reducedMotion={reducedMotion}
          paused={!unlocked}
          lite
        />
        {!unlocked && (
          <div className="absolute inset-0 grid place-items-center bg-[oklch(0.1_0.02_310_/_72%)] backdrop-blur-[3px]">
            <div className="text-center">
              <svg width="18" height="18" viewBox="0 0 18 18" className="mx-auto text-muted-foreground" aria-hidden="true">
                <rect x="3" y="8" width="12" height="8" rx="2" fill="currentColor" opacity="0.8" />
                <path d="M6 8 V6 a3 3 0 0 1 6 0 v2" stroke="currentColor" strokeWidth="1.6" fill="none" />
              </svg>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {p.hours.toFixed(1)} / {p.required} hours
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 bg-[oklch(0.15_0.028_315_/_88%)] px-4 py-3 backdrop-blur-xl">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-base text-foreground">{world.name}</h3>
          {active && (
            <span className="rounded-full border border-[color-mix(in_oklab,var(--primary)_50%,transparent)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[color-mix(in_oklab,var(--primary)_85%,white)]">
              Current
            </span>
          )}
        </div>
        <p className="line-clamp-1 text-[12px] text-muted-foreground">{world.tagline}</p>
        {!unlocked && <Meter value={p.ratio} />}
      </div>
    </button>
  );
}
