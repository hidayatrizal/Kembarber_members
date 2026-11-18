import { Check, ChevronRight, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

const TOTAL = 5;
const FILLED = 3;

export function MemberCardPreview({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative", className)}>
      <div className="relative overflow-hidden rounded-[24px] border border-line/70 bg-surface p-4 shadow-[0_1px_3px_rgba(15,40,25,0.08),0_10px_28px_-22px_rgba(15,40,25,0.3)] md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-[10px] bg-accent text-[16px] font-semibold leading-none text-on-accent md:size-10">
              K
            </span>
            <div className="leading-none">
              <p className="text-[13px] font-semibold text-ink">
                Kembabershop
              </p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                Member card
              </p>
            </div>
          </div>
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-medium text-muted">
            Pratinjau
          </span>
        </div>

        <div className="mt-4">
          <p className="text-[18px] font-semibold leading-none tracking-[-0.01em] text-ink md:text-[20px]">
            Nama kamu
          </p>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent-ink">
            KB-000000
          </p>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
              Kunjungan
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              {Array.from({ length: TOTAL }, (_, index) => {
                const filled = index < FILLED;
                return (
                  <span
                    key={index}
                    className={cn(
                      "grid size-6 place-items-center rounded-full md:size-7",
                      filled
                        ? "bg-accent text-on-accent"
                        : "bg-surface-3",
                    )}
                  >
                    {filled ? (
                      <Check className="size-3 md:size-3.5" strokeWidth={2.6} />
                    ) : (
                      <span className="size-1.5 rounded-full bg-muted/40" />
                    )}
                  </span>
                );
              })}
            </div>
          </div>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-medium text-accent-ink">
            {TOTAL - FILLED} lagi
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-[16px] bg-surface-2 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <QrCode className="size-4 shrink-0 text-ink-soft" strokeWidth={1.9} />
            <p className="truncate text-[11px] font-medium text-ink-soft">
              Check-in di barbershop
            </p>
          </div>
          <ChevronRight className="size-3.5 shrink-0 text-muted/70" />
        </div>
      </div>
    </div>
  );
}
