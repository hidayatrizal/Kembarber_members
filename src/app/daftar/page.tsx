import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { RegisterForm } from "@/components/register-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Daftar Member" };

export default async function RegisterPage() {
  const session = await getSession();
  if (session?.role === "member") redirect("/profil");
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
        <p className="text-[15px] font-semibold text-ink">Daftar</p>
        <span aria-hidden className="size-11" />
      </header>

      <section className="animate-rise mt-6">
        <span className="grid size-12 place-items-center rounded-[16px] bg-accent text-black shadow-[0_12px_30px_-14px_rgba(30,215,96,0.8)]">
          <Sparkles className="size-6" />
        </span>
        <h1 className="mt-5 text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
          Buat kartu member
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Cukup isi data singkat. Kartu langsung aktif dan siap dipakai
          check-in.
        </p>
      </section>

      <div className="animate-rise mt-5 rounded-[24px] border border-line bg-surface p-5">
        <RegisterForm />
      </div>

      <div className="animate-rise mt-auto pt-6">
        <Link
          href="/masuk"
          className="flex h-12 w-full items-center justify-center gap-1 rounded-full border border-white/10 bg-surface text-[13px] font-semibold text-ink transition-colors active:bg-surface-2"
        >
          Sudah punya akun? <span className="text-accent">Masuk</span>
        </Link>
      </div>
    </main>
  );
}
