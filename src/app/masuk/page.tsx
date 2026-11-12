import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
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
      className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-paper px-5 pb-8 pt-3 shadow-[0_0_80px_rgba(0,0,0,0.9)] sm:border-x sm:border-line/80"
      style={{
        backgroundImage:
          "radial-gradient(70% 45% at 50% -12%, rgba(30,215,96,0.12), transparent 65%)",
      }}
    >
      <header className="safe-top flex items-center justify-between py-2">
        <Brand />
        <Link
          href="/daftar"
          className="text-[12px] font-semibold text-muted transition-colors hover:text-ink"
        >
          Daftar
        </Link>
      </header>

      <div className="animate-rise mt-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
          Member club
        </p>
        <h1 className="mt-2 text-balance font-display text-[clamp(2.2rem,10vw,2.9rem)] leading-[0.96] tracking-[-0.02em] text-ink">
          Selamat datang kembali.
        </h1>
        <p className="mt-3 max-w-[300px] text-[13px] leading-relaxed text-muted">
          Masuk dengan nomor HP dan PIN member untuk membuka kartu digitalmu.
        </p>
      </div>

      <div className="animate-rise mt-7 rounded-[28px] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
        <LoginForm next={next} />
      </div>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-muted">
        Lupa PIN? Hubungi kasir atau owner Kembabershop untuk bantuan.
      </p>

      <div className="mt-auto pt-10 text-center text-[9px] font-semibold uppercase tracking-[0.22em] text-muted/60">
        Kembabershop · Member club
      </div>
    </main>
  );
}
