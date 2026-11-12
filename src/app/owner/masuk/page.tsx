import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Brand } from "@/components/brand";
import { OwnerLoginForm } from "@/components/owner-login-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Masuk Owner" };

export default async function OwnerLoginPage() {
  const session = await getSession();
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
        <Brand href="/" />
        <Link
          href="/"
          className="text-[12px] font-semibold text-muted transition-colors hover:text-ink"
        >
          Kembali
        </Link>
      </header>

      <div className="animate-rise mt-10">
        <span className="grid size-11 place-items-center rounded-[14px] bg-accent text-black shadow-[0_0_20px_rgba(30,215,96,0.25)]">
          <ShieldCheck className="size-5" />
        </span>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
          Owner access
        </p>
        <h1 className="mt-2 font-display text-[clamp(2.1rem,10vw,2.7rem)] leading-[0.96] tracking-[-0.02em] text-ink">
          Dashboard owner.
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          Kelola member, pantau kunjungan, dan proses reward Kembabershop.
        </p>
      </div>

      <div className="animate-rise mt-7 rounded-[28px] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
        <OwnerLoginForm />
      </div>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-muted">
        Halaman ini khusus pemilik barbershop. Kredensial diatur melalui
        environment aplikasi.
      </p>

      <div className="mt-auto pt-10 text-center text-[9px] font-semibold uppercase tracking-[0.22em] text-muted/60">
        Kembabershop · Owner console
      </div>
    </main>
  );
}
