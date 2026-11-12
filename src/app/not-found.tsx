import Link from "next/link";
import { Scissors } from "lucide-react";
import { buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-paper px-5 text-center"
      style={{
        backgroundImage:
          "radial-gradient(70% 45% at 50% -12%, rgba(30,215,96,0.10), transparent 65%)",
      }}
    >
      <span className="grid size-14 place-items-center rounded-2xl bg-gold-soft text-gold ring-1 ring-gold/20">
        <Scissors className="size-7" />
      </span>
      <p className="mt-4 font-mono text-3xl font-bold text-gold">404</p>
      <h1 className="mt-1 font-display text-xl font-bold text-ink">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 text-sm text-muted">
        Tautan yang kamu buka mungkin sudah dipindahkan atau tidak tersedia.
      </p>
      <Link href="/" className={buttonClass("primary", "md", "mt-5")}>
        Kembali ke beranda
      </Link>
    </main>
  );
}
