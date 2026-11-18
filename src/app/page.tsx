import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gift, QrCode, WalletCards } from "lucide-react";
import { MemberCardPreview } from "@/components/member-card-preview";
import { OwnerEntry } from "@/components/owner-entry";
import { buttonClass } from "@/components/ui";
import { requireGuest } from "@/lib/auth";
import { LOYALTY_TARGET } from "@/lib/config";

const benefits = [
  { label: "Kartu digital", icon: WalletCards },
  { label: "Check-in QR", icon: QrCode },
  { label: "Reward gratis", icon: Gift },
];

export default async function HomePage() {
  await requireGuest();

  return (
    <main className="welcome-glow relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-paper md:max-w-5xl md:border-x md:border-line">
      <header className="safe-top shrink-0 border-b border-line/70">
        <div className="flex h-14 items-center justify-between pl-4 pr-1.5 md:h-16 md:pl-6 md:pr-3">
          <div className="flex items-center gap-2">
            <Image
              src="/logoapl.png"
              alt="Logo Kembabershop"
              width={467}
              height={400}
              priority
              className="size-9 rounded-[10px] object-contain dark:invert"
            />
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
              Kembabershop
            </span>
          </div>
          <OwnerEntry />
        </div>
      </header>

      <div className="welcome-viewport no-scrollbar flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="flex flex-col md:grid md:w-full md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:gap-12 md:px-8">
          <section className="animate-rise px-4 pt-5 md:px-0 md:py-8">
            <MemberCardPreview className="mx-auto w-full max-w-[400px]" />
          </section>

          <section
            className="animate-rise flex flex-col px-4 pb-4 pt-5 md:px-0 md:py-8"
            style={{ animationDelay: "60ms" }}
          >
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-[11px] font-medium tracking-[0.02em] text-accent-ink">
              Member club
            </span>

            <p className="mt-3 max-w-[34ch] text-[14px] leading-5 text-muted">
              Kartu member, riwayat, dan reward gratis di satu aplikasi.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.label}
                    className="flex flex-col items-center gap-2 rounded-[20px] border border-line/60 bg-surface px-2 py-4"
                  >
                    <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent-ink">
                      <Icon className="size-5" strokeWidth={1.9} aria-hidden />
                    </span>
                    <span className="text-center text-[11px] font-medium leading-tight text-ink-soft">
                      {benefit.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-[12px] leading-4 text-muted">
              <Gift className="size-3.5 shrink-0 text-accent-ink" aria-hidden />
              Gratis tiap {LOYALTY_TARGET} kunjungan.
            </p>

            <div className="mt-6 hidden md:block">
              <WelcomeActions />
            </div>
          </section>
        </div>
      </div>

      <div
        className="animate-rise shrink-0 border-t border-line/70 bg-surface px-4 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-3 md:hidden"
        style={{ animationDelay: "120ms" }}
      >
        <WelcomeActions />
      </div>
    </main>
  );
}

function WelcomeActions() {
  return (
    <div className="flex flex-col gap-2">
      <Link
        href="/daftar"
        className={buttonClass("primary", "lg", "w-full")}
      >
        Buat kartu member
        <ArrowRight className="size-4" aria-hidden />
      </Link>
      <Link href="/masuk" className={buttonClass("secondary", "lg", "w-full")}>
        Masuk
      </Link>
    </div>
  );
}
