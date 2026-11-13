import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Masuk Member" };

function safeNext(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/profil";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const session = await getSession();
  if (session?.role === "member") redirect("/profil");
  if (session?.role === "owner") redirect("/owner");

  const params = await searchParams;
  const next = safeNext(params.next);

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
        <p className="text-[15px] font-semibold text-ink">Masuk</p>
        <span aria-hidden className="size-11" />
      </header>

      <section className="animate-rise mt-8">
        <span className="grid size-12 place-items-center rounded-[16px] bg-accent text-black shadow-[0_12px_30px_-14px_rgba(30,215,96,0.8)]">
          <ShieldCheck className="size-6" />
        </span>
        <h1 className="mt-5 text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
          Masuk ke akun member
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Gunakan nomor HP dan PIN yang kamu daftarkan.
        </p>
      </section>

      <div className="animate-rise mt-6 rounded-[24px] border border-line bg-surface p-5">
        <LoginForm next={next} />
      </div>

      <p className="mt-4 text-center text-[11px] text-muted">
        Lupa PIN? Hubungi kasir.
      </p>

      <div className="animate-rise mt-auto pt-8">
        <Link
          href="/daftar"
          className="flex h-12 w-full items-center justify-center rounded-full border border-white/10 bg-surface text-[13px] font-semibold text-ink transition-colors active:bg-surface-2"
        >
          Belum punya kartu? Daftar
        </Link>
      </div>
    </main>
  );
}
