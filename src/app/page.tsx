import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  Gift,
  History,
  MapPin,
  QrCode,
  UserRound,
  WalletCards,
} from "lucide-react";
import { MemberCardPreview } from "@/components/member-card-preview";
import { OwnerEntry } from "@/components/owner-entry";
import { buttonClass } from "@/components/ui";
import { requireGuest } from "@/lib/auth";
import {
  SHOP_ADDRESS,
  SHOP_CLOSE_HOUR,
  SHOP_OPEN_HOUR,
} from "@/lib/config";
import { getShopHistorySettings } from "@/lib/shop";

const benefits = [
  { label: "Kartu digital", icon: WalletCards },
  { label: "Check-in QR", icon: QrCode },
  { label: "Reward gratis", icon: Gift },
];

const CAPSTER_COUNT = 2;

export default async function HomePage() {
  await requireGuest();
  const { historyImageUrl, hasCustomHistoryImage } =
    await getShopHistorySettings();

  return (
    <main className="welcome-glow relative mx-auto flex h-dvh w-full flex-col overflow-hidden bg-paper md:max-w-5xl md:border-x md:border-line">
      <header className="safe-top shrink-0 border-b border-line/70">
        <div className="flex h-14 items-center justify-between px-4 md:h-16 md:px-6">
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
        <div className="flex flex-col md:grid md:w-full md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:gap-12 md:px-6">
          <section className="animate-rise px-4 pt-5 md:px-0 md:py-8">
            <MemberCardPreview className="w-full md:mx-auto md:max-w-[400px]" />
          </section>

          <section
            className="animate-rise flex flex-col px-4 pb-6 pt-5 md:px-0 md:py-8"
            style={{ animationDelay: "60ms" }}
          >
            <div className="grid grid-cols-3 gap-2">
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

            <div className="mt-4 space-y-2.5">
              <div className="overflow-hidden rounded-[22px] border border-line/60 bg-surface">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={historyImageUrl}
                    alt="Suasana Kembabershop"
                    fill
                    unoptimized={hasCustomHistoryImage}
                    sizes="(max-width: 768px) 100vw, 460px"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <History
                      className="size-4 shrink-0 text-accent-ink"
                      strokeWidth={1.9}
                      aria-hidden
                    />
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                      Sejarah
                    </p>
                    <span className="ml-auto rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted">
                      Sejak 2019
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] leading-5 text-ink-soft">
                    Berawal dari satu kursi, Kembabershop tumbuh jadi tempat
                    cukur langganan warga.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-[22px] border border-line/60 bg-surface p-4">
                  <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent-ink">
                    <MapPin className="size-5" strokeWidth={1.9} aria-hidden />
                  </span>
                  <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                    Lokasi
                  </p>
                  <p className="mt-1 text-[13px] font-semibold leading-4 text-ink">
                    {SHOP_ADDRESS}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-[11px] text-muted">
                    <Clock className="size-3 shrink-0" aria-hidden />
                    {SHOP_OPEN_HOUR}.00–{SHOP_CLOSE_HOUR}.00
                  </p>
                </div>

                <div className="rounded-[22px] border border-line/60 bg-surface p-4">
                  <div className="flex -space-x-2.5">
                    {Array.from({ length: CAPSTER_COUNT }, (_, index) => (
                      <span
                        key={index}
                        className="grid size-10 place-items-center rounded-full border-2 border-surface bg-accent-soft text-accent-ink"
                      >
                        <UserRound
                          className="size-4"
                          strokeWidth={1.9}
                          aria-hidden
                        />
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                    Capster
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-ink">
                    {CAPSTER_COUNT} orang
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-[11px] text-muted">
                    Siap melayani
                  </p>
                </div>
              </div>
            </div>

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
