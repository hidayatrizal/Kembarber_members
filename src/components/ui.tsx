import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-on-accent hover:bg-accent-strong active:scale-[0.985] shadow-[0_10px_24px_-14px_rgba(30,215,96,0.55)]",
  secondary:
    "border border-line bg-surface text-ink hover:bg-surface-2 active:scale-[0.985]",
  ghost: "text-ink-soft hover:bg-surface-2 active:scale-[0.985]",
  accent:
    "bg-accent text-on-accent hover:bg-accent-strong active:scale-[0.985] shadow-[0_10px_24px_-14px_rgba(30,215,96,0.55)]",
  danger:
    "border border-bad/20 bg-bad-soft text-bad hover:bg-bad/10 active:scale-[0.985]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 gap-1.5 px-3.5 text-[12px]",
  md: "h-11 gap-2 px-4 text-[13px]",
  lg: "h-12 gap-2 px-5 text-[14px]",
};

export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(
    "inline-flex select-none items-center justify-center rounded-full font-semibold transition-all duration-150 touch-manipulation disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button className={buttonClass(variant, size, className)} {...props} />
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-line bg-surface shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

type Tone = "accent" | "gold" | "good" | "muted" | "bad";

export function Badge({
  children,
  tone = "accent",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const tones: Record<Tone, string> = {
    accent: "bg-accent-soft text-accent",
    gold: "bg-gold-soft text-gold",
    good: "bg-accent-soft text-accent",
    muted: "bg-surface-2 text-muted",
    bad: "bg-bad-soft text-bad",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  max,
  className,
  barClassName,
}: {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-paper-deep",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-accent transition-[width] duration-700 ease-out",
          barClassName,
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Avatar({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full bg-surface-3 text-[13px] font-bold text-ink ring-1 ring-line",
        className,
      )}
    >
      {initials || "?"}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  className,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-line-strong bg-surface/50 px-6 py-9 text-center",
        className,
      )}
    >
      {icon ? <div className="mb-3 text-muted">{icon}</div> : null}
      <p className="text-sm font-bold text-ink">{title}</p>
      {description ? (
        <p className="mt-1 max-w-[280px] text-[12px] leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[11px] font-bold uppercase tracking-[0.18em] text-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}
