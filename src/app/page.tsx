import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Gift, QrCode, Sparkles } from "lucide-react";
import { Brand } from "@/components/brand";
import { buttonClass } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { LOYALTY_TARGET } from "@/lib/config";

const benefits = [
  {
    title: "Kartu member digital",
    description: "Identitas member tersimpan langsung di HP.",
    icon: Sparkles,
  },
  {
    title: "Check-in pakai QR",
    description: "Scan QR di barbershop, kunjungan tercatat otomatis.",
    icon: QrCode,
  },
  {
    title: `Setiap ${LOYALTY_TARGET} cukur`,
    description: "Dapat 1 cukur gratis tanpa perlu kartu fisik.",
    icon: Gift,
  },
];

export default async function HomePage() {
  const session = await getSession();
  if (session?.role === "member") redirect("/profil");
  if (session?.role === "owner") redirect("/owner");

  return (
    <main
      className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-paper px-5"
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 1.25rem)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)",
        backgroundImage:
          "radial-gradient(70% 45% at 50% -12%, rgba(30,215,96,0.14), transparent 65%)",
      }}
    >
      <header className="flex items-center justify-between">
        <Brand />
        <Link
          href="/owner/masuk"
          className="rounded-full px-3 py-2 text-[11px] font-semibold text-muted transition-colors active:bg-overlay"
        >
          Owner
        </Link>
      </header>

      <section className="animate-rise flex-1 pt-8">
        <div className="grid size-16 place-items-center rounded-[20px] bg-accent text-[28px] font-extrabold leading-none text-on-accent shadow-[0_16px_40px_-16px_rgba(30,215,96,0.8)]">
          K
        </div>

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Kembabershop member
        </p>
        <h1 className="mt-2 text-balance text-[32px] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink">
          Cukur rapi.
          <br />
          <span className="text-accent">Pulang berhadiah.</span>
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          Kartu member digital, riwayat cukur, dan reward gratis dalam satu
          aplikasi.
        </p>

        <ul className="mt-8 space-y-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <li
                key={benefit.title}
                className="flex items-center gap-3 rounded-[20px] border border-line bg-surface p-3.5"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <Icon className="size-5" strokeWidth={1.9} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-ink">
                    {benefit.title}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                    {benefit.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="animate-rise mt-8 space-y-2">
        <Link
          href="/daftar"
          className={buttonClass("primary", "lg", "h-14 w-full text-[15px]")}
        >
          Buat kartu member <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/masuk"
          className="flex h-12 w-full items-center justify-center gap-1 rounded-full text-[13px] font-semibold text-ink-soft transition-colors active:bg-overlay"
        >
          Sudah punya akun? <span className="text-accent">Masuk</span>
        </Link>
      </div>
    </main>
  );
}
