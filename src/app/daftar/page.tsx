import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { RegisterForm } from "@/components/register-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Daftar Member" };

export default async function RegisterPage() {
  const session = await getSession();
  if (session?.role === "member") redirect("/profil");
  if (session?.role === "owner") redirect("/owner");

  return (
    <main
      className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-paper px-5 pb-8 pt-3 shadow-[0_0_80px_rgba(0,0,0,0.9)] sm:my-6 sm:min-h-[calc(100dvh-3rem)] sm:rounded-[2.75rem] sm:border sm:border-white/10"
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
        <h1 className="font-display text-[clamp(2.2rem,10vw,2.9rem)] leading-[0.96] tracking-[-0.02em] text-ink">
          Daftar
        </h1>
      </div>

      <div className="animate-rise mt-5 rounded-[28px] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
        <RegisterForm />
      </div>
    </main>
  );
}
