import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Gift,
  QrCode,
  Scissors,
  Sparkles,
  Star,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { buttonClass } from "@/components/ui";
import { LOYALTY_TARGET, SHOP_NAME, SHOP_TAGLINE } from "@/lib/config";

const steps = [
  {
    title: "Daftar sekali",
    description: "Buat kartu member digital dengan nomor HP dan PIN.",
    icon: Sparkles,
  },
  {
    title: "Scan & check-in",
    description: "Setelah cukur selesai, scan QR di barbershop untuk mencatat kunjungan.",
    icon: QrCode,
  },
  {
    title: "Kumpulkan hadiah",
    description: `Setiap ${LOYALTY_TARGET} cukur berbayar, dapat 1 cukur gratis.`,
    icon: Gift,
  },
];

const benefits = [
  "Riwayat cukur tersimpan otomatis",
  "Pantau sisa cukur menuju hadiah",
  "Reward tidak bisa dipakai dua kali",
];

export default function HomePage() {
  return (
    <main
      className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-paper px-5 pb-10 pt-3 shadow-[0_0_80px_rgba(0,0,0,0.9)] sm:border-x sm:border-line/80"
      style={{
        backgroundImage:
          "radial-gradient(70% 45% at 50% -12%, rgba(30,215,96,0.12), transparent 65%)",
      }}
    >
      <header className="safe-top flex items-center justify-between py-2">
        <Brand />
        <Link
          href="/masuk"
          className="text-[12px] font-semibold text-muted transition-colors hover:text-ink"
        >
          Masuk
        </Link>
      </header>

      <section className="animate-rise mt-9">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">
          <span className="size-1.5 rounded-full bg-accent" />
          {SHOP_NAME} · Member club
        </span>
        <h1 className="mt-5 text-balance font-display text-[clamp(2.2rem,10.5vw,3rem)] leading-[0.94] tracking-[-0.03em] text-ink">
          Cukur rapi.
          <br />
          <span className="block text-accent">Pulang berhadiah.</span>
        </h1>
        <p className="mt-5 max-w-[320px] text-[13px] leading-relaxed text-muted">
          Kartu member digital untuk setiap kunjungan. Tanpa kartu fisik, tanpa
          catatan manual. {SHOP_TAGLINE}
        </p>

        <div className="mt-7">
          <Link href="/daftar" className={buttonClass("primary", "lg", "w-full")}>
            Buat kartu member <ArrowRight className="size-4" />
          </Link>
          <p className="mt-3.5 text-center text-[12px] text-muted">
            Sudah member?{" "}
            <Link
              href="/masuk"
              className="font-semibold text-ink underline decoration-line-strong underline-offset-4"
            >
              Masuk
            </Link>
          </p>
        </div>
      </section>

      <section className="animate-rise relative mt-9 aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[var(--shadow-lift)]">
        <Image
          src="/barbershop.jpg"
          alt="Suasana barbershop Kembabershop"
          fill
          priority
          sizes="(max-width: 460px) 100vw, 460px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/90" />

        <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md">
          <Star className="size-3.5 fill-gold text-gold" />
          <span className="text-[11px] font-semibold text-white">
            Premium member
          </span>
        </div>

        <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
          <div>
            <p className="text-[17px] font-bold leading-tight text-white">
              4/5 Potongan
            </p>
            <p className="mt-1 text-[11px] text-gray-300">
              Kembabershop Pusat, Jakarta
            </p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-black shadow-lg">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </section>

      <div className="animate-rise mt-4 flex items-center gap-3 rounded-[22px] border border-accent/15 bg-accent-soft px-4 py-3.5">
        <Gift className="size-4 shrink-0 text-accent" />
        <p className="text-[12px] font-semibold leading-snug text-accent-ink">
          Setiap {LOYALTY_TARGET} cukur berbayar, kamu dapat 1 cukur gratis.
        </p>
      </div>

      <section className="mt-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
          Cara kerja
        </p>
        <div className="mt-3 divide-y divide-line border-y border-line">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex gap-4 py-4">
                <span className="font-display text-[1.4rem] leading-none text-accent/60">
                  0{index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="size-3.5 text-accent" />
                    <p className="text-[13px] font-bold text-ink">
                      {step.title}
                    </p>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="animate-rise mt-8 rounded-[26px] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2">
          <Scissors className="size-4 text-accent" />
          <p className="text-[13px] font-bold text-ink">Yang kamu dapat</p>
        </div>
        <ul className="mt-3.5 space-y-3">
          {benefits.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 text-[12px] font-medium text-ink"
            >
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-good-soft text-good">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-10 flex flex-col items-center gap-3 border-t border-line pt-7 text-center">
        <Brand href="/" />
        <p className="text-[11px] text-muted">
          Punya barbershop?{" "}
          <Link href="/owner/masuk" className="font-semibold text-accent">
            Masuk owner
          </Link>
        </p>
        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-muted/60">
          {SHOP_NAME} · Member club
        </p>
      </footer>
    </main>
  );
}
