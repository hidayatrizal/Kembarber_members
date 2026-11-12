import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Gift, QrCode, Scissors } from "lucide-react";
import { Brand } from "@/components/brand";
import { RegisterForm } from "@/components/register-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Daftar Member" };

const perks = [
  { icon: QrCode, label: "Check-in via QR" },
  { icon: Gift, label: "5 cukur, 1 gratis" },
  { icon: Scissors, label: "Riwayat otomatis" },
];

export default async function RegisterPage() {
  const session = await getSession();
  if (session?.role === "member") redirect("/profil");
  if (session?.role === "owner") redirect("/owner");

  return (
    <main
      className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-paper px-5 pb-8 pt-3 shadow-[0_0_80px_rgba(0,0,0,0.9)] sm:border-x sm:border-line/80"
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

      <div className="animate-rise mt-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
          Member baru
        </p>
        <h1 className="mt-2 text-balance font-display text-[clamp(2.2rem,10vw,2.9rem)] leading-[0.96] tracking-[-0.02em] text-ink">
          Buat kartu member.
        </h1>
        <p className="mt-3 max-w-[310px] text-[13px] leading-relaxed text-muted">
          Satu kartu digital untuk mencatat kunjungan dan mengumpulkan hadiah
          loyalitasmu.
        </p>
      </div>

      <div className="animate-rise mt-5 flex flex-wrap gap-2">
        {perks.map((perk) => {
          const Icon = perk.icon;
          return (
            <span
              key={perk.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[10px] font-semibold text-ink-soft"
            >
              <Icon className="size-3 text-accent" />
              {perk.label}
            </span>
          );
        })}
      </div>

      <div className="animate-rise mt-5 rounded-[28px] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
        <RegisterForm />
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-paper-deep/60 px-4 py-3">
        <QrCode className="mt-0.5 size-4 shrink-0 text-accent" />
        <p className="text-[11px] leading-relaxed text-muted">
          Daftar sambil di barbershop? Scan QR yang tersedia, lalu isi formulir
          ini. Setelah itu kamu bisa langsung check-in.
        </p>
      </div>

      <div className="mt-auto pt-10 text-center text-[9px] font-semibold uppercase tracking-[0.22em] text-muted/60">
        Kembabershop · Member club
      </div>
    </main>
  );
}
