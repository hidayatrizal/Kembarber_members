import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Gift, QrCode, Sparkles } from "lucide-react";
import { Brand } from "@/components/brand";
import { buttonClass, ProgressBar } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { LOYALTY_TARGET } from "@/lib/config";

const features = [
  { title: "Daftar", icon: Sparkles },
  { title: "Scan", icon: QrCode },
  { title: "Gratis", icon: Gift },
];

export default async function HomePage() {
  const session = await getSession();
  if (session?.role === "member") redirect("/profil");
  if (session?.role === "owner") redirect("/owner");

  return (
    <main
      className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-paper px-5 pb-8 pt-3 shadow-[0_0_80px_rgba(0,0,0,0.9)] sm:my-6 sm:min-h-[calc(100dvh-3rem)] sm:rounded-[2.75rem] sm:border sm:border-white/10"
      style={{
        backgroundImage:
          "radial-gradient(70% 45% at 50% -12%, rgba(30,215,96,0.14), transparent 65%)",
      }}
    >
      <header className="safe-top flex items-center justify-between py-2">
        <Brand />
        <Link
          href="/masuk"
          className="rounded-full border border-white/10 bg-surface px-3.5 py-1.5 text-[11px] font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          Masuk
        </Link>
      </header>

      <section className="animate-rise mt-10">
        <h1 className="text-balance font-display text-[clamp(2.4rem,11vw,3.2rem)] leading-[0.92] tracking-[-0.03em] text-ink">
          Cukur rapi.
          <br />
          <span className="block text-accent">Pulang berhadiah.</span>
        </h1>
      </section>

      <section className="animate-rise relative mt-8 overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-surface-3 via-surface to-paper-deep p-5 shadow-[var(--shadow-lift)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-accent/20 blur-3xl"
        />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brand showText={false} />
            <p className="text-[11px] font-bold text-ink">Kembabershop</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.18em] text-muted">
            Preview
          </span>
        </div>

        <div className="relative mt-7">
          <p className="font-display text-[1.55rem] leading-none text-ink">
            Nama kamu
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            KB-••••••
          </p>
        </div>

        <div className="relative mt-7 flex items-end justify-between gap-3">
          <p className="text-[13px] font-bold text-ink">
            4/{LOYALTY_TARGET} cukur
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-gold">
            <Gift className="size-3" /> 1 gratis
          </span>
        </div>

        <ProgressBar
          value={4}
          max={LOYALTY_TARGET}
          className="relative mt-2"
        />
      </section>

      <section className="animate-rise mt-4 grid grid-cols-3 gap-2.5">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-surface py-3.5"
            >
              <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-accent">
                <Icon className="size-4" />
              </span>
              <p className="text-[10px] font-bold text-ink">{feature.title}</p>
            </div>
          );
        })}
      </section>

      <div className="mt-auto pt-8">
        <Link href="/daftar" className={buttonClass("primary", "lg", "w-full")}>
          Buat kartu <ArrowRight className="size-4" />
        </Link>
      </div>
    </main>
  );
}
