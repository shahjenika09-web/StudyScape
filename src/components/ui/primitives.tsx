import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("glass-panel rounded-3xl", className)}>{children}</div>;
}

export function PanelHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle?: string;
  onClose?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--hairline)] px-5 py-4">
      <div>
        <h2 className="font-display text-lg tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{subtitle}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--hairline)] text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </h3>
  );
}

export function OptionChip({
  active,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "rounded-xl border px-3 py-2 text-[12px] font-medium transition-all duration-300",
        active
          ? "border-[color-mix(in_oklab,var(--primary)_55%,transparent)] bg-[color-mix(in_oklab,var(--primary)_16%,transparent)] text-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_18%,transparent),0_6px_18px_-10px_color-mix(in_oklab,var(--primary)_60%,transparent)] -translate-y-px"
          : "border-[var(--hairline)] bg-white/[0.03] text-muted-foreground hover:border-white/20 hover:bg-white/[0.07] hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ToggleRow({
  label,
  description,
  checked,
  onChange,
  icon,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all duration-300",
        checked
          ? "border-[color-mix(in_oklab,var(--primary)_45%,transparent)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]"
          : "border-[var(--hairline)] bg-white/[0.03] hover:bg-white/[0.06]",
      )}
    >
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-foreground">{label}</span>
        {description && (
          <span className="block truncate text-[11px] text-muted-foreground">{description}</span>
        )}
      </span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300",
          checked ? "bg-[var(--primary)]" : "bg-white/12",
        )}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-[oklch(0.98_0.01_90)] transition-transform duration-300"
          style={{ transform: `translateX(${checked ? 18 : 2}px)` }}
        />
      </span>
    </button>
  );
}

export function Meter({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/8", className)}>
      <div
        className="h-full rounded-full transition-[width] duration-700"
        style={{
          width: `${Math.max(0, Math.min(1, value)) * 100}%`,
          background: "var(--gradient-ember)",
        }}
      />
    </div>
  );
}

export function ActionButton({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" &&
          "bg-[image:var(--gradient-ember)] text-[oklch(0.2_0.03_40)] shadow-[0_10px_28px_-12px_color-mix(in_oklab,var(--ember)_80%,transparent)] hover:brightness-110",
        variant === "ghost" &&
          "border border-[var(--hairline)] bg-white/[0.04] text-foreground hover:bg-white/[0.09]",
        variant === "danger" &&
          "border border-[color-mix(in_oklab,var(--destructive)_50%,transparent)] text-[color-mix(in_oklab,var(--destructive)_85%,white)] hover:bg-[color-mix(in_oklab,var(--destructive)_16%,transparent)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  display,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  display?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-[12px] text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums text-foreground/80">{display ?? `${Math.round(value * 100)}%`}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[var(--primary)]"
      />
    </label>
  );
}
