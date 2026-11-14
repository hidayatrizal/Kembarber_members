import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Gift, QrCode, WalletCards } from "lucide-react";
import { Brand } from "@/components/brand";
import { MemberCardPreview } from "@/components/member-card-preview";
import { OwnerEntry } from "@/components/owner-entry";
import { buttonClass } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { LOYALTY_TARGET } from "@/lib/config";

const benefits = [
  {
    title: "Kartu member digital",
    description: "Identitas member tersimpan langsung di HP.",
    icon: WalletCards,
  },
  {
    title: "Check-in pakai QR",
    description: "Scan QR, kunjungan tercatat otomatis.",
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
    <main className="welcome-glow relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-paper md:max-w-5xl md:border-x md:border-line">
      <header className="safe-top flex min-h-16 shrink-0 items-center justify-between gap-3 px-4 pb-2 md:min-h-20 md:px-10">
        <Brand />
        <OwnerEntry />
      </header>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto md:flex">
        <div className="flex flex-col md:my-auto md:grid md:w-full md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:gap-12 md:px-10">
          <section className="animate-rise px-4 pt-2 md:px-0 md:py-10">
            <MemberCardPreview className="mx-auto w-full max-w-[420px]" />
          </section>

          <section
            className="animate-rise flex flex-col px-4 pb-6 pt-5 md:px-0 md:py-10"
            style={{ animationDelay: "60ms" }}
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-accent-ink">
              Kembabershop member
            </p>
            <h1 className="mt-2 text-balance font-display text-[clamp(1.9rem,8vw,2.5rem)] font-extrabold leading-[1.12] tracking-[-0.02em] text-ink">
              Cukur rapi.
              <br />
              <span className="text-accent">Pulang berhadiah.</span>
            </h1>
            <p className="mt-2 max-w-[36ch] text-[14px] leading-relaxed text-muted">
              Kartu member digital, riwayat cukur, dan reward gratis dalam satu
              aplikasi.
            </p>

            <ul className="mt-5 divide-y divide-line overflow-hidden rounded-[24px] border border-line bg-surface">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <li
                    key={benefit.title}
                    className="flex min-h-16 items-center gap-3 px-4 py-3"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-ink">
                      <Icon
                        className="size-5"
                        strokeWidth={1.9}
                        aria-hidden
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-ink">
                        {benefit.title}
                      </p>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-muted">
                        {benefit.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-7 hidden md:block">
              <WelcomeActions />
            </div>
          </section>
        </div>
      </div>

      <div
        className="animate-rise shrink-0 border-t border-line bg-surface px-4 pb-[calc(env(safe-area-inset-bottom,0px)+0.9rem)] pt-3 md:hidden"
        style={{ animationDelay: "120ms" }}
      >
        <WelcomeActions />
      </div>
    </main>
  );
}

function WelcomeActions() {
  return (
    <div className="space-y-2">
      <Link
        href="/daftar"
        className={buttonClass(
          "primary",
          "lg",
          "h-[52px] w-full rounded-full text-[14px] font-bold active:scale-100",
        )}
      >
        Buat kartu member
        <ArrowRight className="size-4" aria-hidden />
      </Link>
      <Link
        href="/masuk"
        className="flex h-12 w-full items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold text-ink-soft transition-colors touch-manipulation active:bg-overlay"
      >
        Sudah punya akun?
        <span className="font-bold text-accent-ink">Masuk</span>
      </Link>
      <p className="pt-0.5 text-center text-[11px] leading-relaxed text-muted">
        Gratis · Tanpa kartu fisik · Aktif langsung
      </p>
    </div>
  );
}