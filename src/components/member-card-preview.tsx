import Image from "next/image";
import { Check, ChevronRight, QrCode, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const TOTAL = 5;
const FILLED = 3;

export function MemberCardPreview({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative", className)}>
      <div className="bg-card-blue relative overflow-hidden rounded-[16px] p-4 text-white shadow-[0_18px_40px_-26px_rgba(11,32,56,0.75)] md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logoapl.png"
              alt=""
              width={467}
              height={400}
              className="size-9 rounded-[10px] object-contain brightness-0 invert md:size-10"
            />
            <div className="leading-none">
              <p className="text-[14px] font-medium text-white">Kembabershop</p>
              <p className="mt-1 text-[12px] leading-4 text-fog">
                Kartu member
              </p>
            </div>
          </div>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white/80">
            Pratinjau
          </span>
        </div>

        <div className="mt-4">
          <p className="text-[20px] font-medium leading-6 text-white">
            Nama kamu
          </p>
          <span className="mt-1 inline-flex rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-[11px] font-medium text-white/90">
            KB-000000
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[12px] font-medium leading-4 text-fog">
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
                      filled ? "bg-accent text-on-accent" : "bg-steel",
                    )}
                  >
                    {filled ? (
                      <Check className="size-3 md:size-3.5" strokeWidth={2.6} />
                    ) : (
                      <span className="size-1.5 rounded-full bg-[#10304f]/45" />
                    )}
                  </span>
                );
              })}
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent-ink">
            <Zap className="size-3" strokeWidth={2.4} aria-hidden />
            {TOTAL - FILLED} lagi
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-[12px] bg-white/15 px-3 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <QrCode
              className="size-4 shrink-0 text-white/80"
              strokeWidth={1.8}
            />
            <p className="truncate text-[12px] font-medium text-white/90">
              Check-in di barbershop
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0 text-white/60" />
        </div>
      </div>
    </div>
  );
}
