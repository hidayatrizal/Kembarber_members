"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { buttonClass } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDb = /DATABASE_URL|database|connect/i.test(error.message);

  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-paper px-5 text-center"
      style={{
        backgroundImage:
          "radial-gradient(70% 45% at 50% -12%, rgba(30,215,96,0.10), transparent 65%)",
      }}
    >
      <span className="grid size-14 place-items-center rounded-2xl bg-bad-soft text-bad ring-1 ring-bad/20">
        <AlertTriangle className="size-7" />
      </span>
      <h1 className="mt-4 font-display text-xl font-bold text-ink">
        Terjadi kesalahan
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {isDb
          ? "Database belum terhubung. Pastikan DATABASE_URL sudah diatur dan tabel sudah dibuat (npm run db:push)."
          : "Halaman gagal dimuat. Silakan coba lagi."}
      </p>
      <button
        type="button"
        onClick={reset}
        className={buttonClass("primary", "md", "mt-5")}
      >
        <RotateCcw className="size-4" /> Coba lagi
      </button>
    </main>
  );
}
