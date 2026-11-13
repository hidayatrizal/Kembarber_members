import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { OwnerLoginForm } from "@/components/owner-login-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Masuk Owner" };

export default async function OwnerLoginPage() {
  const session = await getSession();
  if (session?.role === "owner") redirect("/owner");

  return (
    <main
      className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-paper px-5"
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.75rem)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)",
        backgroundImage:
          "radial-gradient(70% 45% at 50% -12%, rgba(30,215,96,0.12), transparent 65%)",
      }}
    >
      <header className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Kembali"
          className="grid size-11 place-items-center rounded-full text-ink-soft transition-colors active:bg-white/5"
        >
          <ArrowLeft className="size-5" strokeWidth={2.2} />
        </Link>
        <p className="text-[15px] font-semibold text-ink">Owner</p>
        <span aria-hidden className="size-11" />
      </header>

      <section className="animate-rise mt-8">
        <span className="grid size-12 place-items-center rounded-[16px] bg-accent text-black shadow-[0_12px_30px_-14px_rgba(30,215,96,0.8)]">
          <ShieldCheck className="size-6" />
        </span>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          Owner access
        </p>
        <h1 className="mt-1 text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
          Dashboard owner
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Kelola member, pantau kunjungan, dan proses reward Kembabershop.
        </p>
      </section>

      <div className="animate-rise mt-6 rounded-[24px] border border-line bg-surface p-5">
        <OwnerLoginForm />
      </div>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">
        Halaman ini khusus pemilik barbershop. Kredensial diatur melalui
        environment aplikasi.
      </p>

      <div className="mt-auto pt-8 text-center text-[9px] font-semibold uppercase tracking-[0.22em] text-muted/60">
        Kembabershop · Owner console
      </div>
    </main>
  );
}
