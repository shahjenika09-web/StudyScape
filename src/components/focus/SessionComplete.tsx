import { ActionButton } from "@/components/ui/primitives";
import { formatDuration } from "@/lib/format";

export function SessionComplete({
  seconds,
  worldName,
  onAgain,
  onHome,
}: {
  seconds: number;
  worldName: string;
  onAgain: () => void;
  onHome: () => void;
}) {
  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-[oklch(0.1_0.02_312_/_72%)] px-4 backdrop-blur-md">
      <div className="glass-panel animate-rise w-full max-w-sm rounded-[28px] px-7 py-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Session complete</p>
        <h2 className="mt-3 font-display text-3xl text-foreground">{formatDuration(seconds)}</h2>
        <p className="mt-2 text-[13px] text-muted-foreground">focused in the {worldName}.</p>
        <div className="mt-7 flex flex-col gap-2">
          <ActionButton onClick={onAgain}>Another session</ActionButton>
          <ActionButton variant="ghost" onClick={onHome}>
            Back home
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
