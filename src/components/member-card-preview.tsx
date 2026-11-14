import { Check, ChevronRight, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

const TOTAL = 5;
const FILLED = 3;

export function MemberCardPreview({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative", className)}>
      <div className="pointer-events-none absolute -inset-5 rounded-[40px] bg-accent/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[28px] border border-line bg-gradient-to-br from-surface-3 via-surface-2 to-surface p-4 shadow-[var(--shadow-lift)] md:p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-[14px] bg-accent text-[18px] font-extrabold leading-none text-on-accent shadow-[0_0_18px_rgba(30,215,96,0.28)]">
              K
            </span>
            <div className="leading-none">
              <p className="text-[13px] font-bold text-ink">Kembabershop</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                Member card
              </p>
            </div>
          </div>
          <span className="rounded-full bg-surface/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted ring-1 ring-line">
            Pratinjau
          </span>
        </div>

        <div className="relative mt-5">
          <p className="text-[20px] font-bold leading-none tracking-[-0.01em] text-ink">
            Nama kamu
          </p>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-ink">
            KB-000000
          </p>
        </div>

        <div className="relative mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              Kunjungan
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              {Array.from({ length: TOTAL }, (_, index) => {
                const filled = index < FILLED;
                return (
                  <span
                    key={index}
                    className={cn(
                      "grid size-7 place-items-center rounded-full",
                      filled
                        ? "bg-accent text-on-accent"
                        : "bg-surface ring-1 ring-line-strong",
                    )}
                  >
                    {filled ? (
                      <Check className="size-3.5" strokeWidth={2.6} />
                    ) : (
                      <span className="size-1.5 rounded-full bg-muted/50" />
                    )}
                  </span>
                );
              })}
            </div>
          </div>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-accent-ink">
            {TOTAL - FILLED} lagi
          </span>
        </div>

        <div className="relative mt-3 hidden items-center justify-between gap-3 rounded-[16px] border border-line bg-surface/70 px-3 py-2 md:flex">
          <div className="flex min-w-0 items-center gap-2">
            <QrCode className="size-4 shrink-0 text-ink-soft" strokeWidth={1.9} />
            <p className="truncate text-[11px] font-semibold text-ink-soft">
              Check-in di barbershop
            </p>
          </div>
          <ChevronRight className="size-3.5 shrink-0 text-muted/70" />
        </div>
      </div>
    </div>
  );
}