import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "h-12 w-full rounded-[14px] border border-line bg-surface px-4 text-[15px] text-ink caret-accent placeholder:text-muted/50 outline-none transition-colors focus:border-accent/70 focus:ring-4 focus:ring-accent/10 disabled:opacity-50";

export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-[12px] font-semibold text-ink-soft"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="text-[11px] leading-relaxed text-muted">{hint}</p> : null}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-2xl border border-bad/20 bg-bad-soft px-4 py-3 text-[12px] font-medium leading-relaxed text-bad"
    >
      {message}
    </div>
  );
}
