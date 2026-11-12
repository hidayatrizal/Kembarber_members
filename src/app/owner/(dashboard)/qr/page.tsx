import type { Metadata } from "next";
import { headers } from "next/headers";
import { Info, QrCode, ScanLine, Smartphone } from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { Card } from "@/components/ui";
import { CHECKIN_COOLDOWN_HOURS } from "@/lib/config";

export const metadata: Metadata = { title: "QR Check-in" };

export default async function QrPage() {
  const headerStore = await headers();
  const host = headerStore.get("host") ?? "localhost:3000";
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const base = configured || `${proto}://${host}`;

  return (
    <div className="space-y-6">
      <header className="animate-rise">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
          Akses member
        </p>
        <h1 className="mt-1 text-balance font-display text-[clamp(2rem,8vw,2.6rem)] leading-[0.98] tracking-[-0.02em] text-ink">
          QR check-in.
        </h1>
        <p className="mt-2 max-w-xl text-[13px] text-muted">
          Cetak dan tempel QR ini di dalam barbershop. Member scan lewat kamera
          di halaman check-in, lalu kunjungan langsung tercatat.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="animate-rise flex flex-col items-center p-6">
          <div className="rounded-[1.5rem] bg-white p-3 shadow-[0_24px_60px_-30px_rgba(30,215,96,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/qr"
              alt="QR Code check-in Kembabershop"
              width={320}
              height={320}
              className="size-64 rounded-xl lg:size-72"
            />
          </div>
          <p className="mt-5 text-center text-[13px] font-semibold text-ink">
            Scan untuk check-in cukur
          </p>
          <p className="mt-1 break-all text-center font-mono text-[10px] text-muted">
            {base}/checkin
          </p>
          <div className="mt-4">
            <PrintButton />
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="animate-rise overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-4">
              <ScanLine className="size-4 text-accent" />
              <h2 className="text-[13px] font-bold text-ink">Cara pakai</h2>
            </div>
            <ol className="space-y-3 p-5">
              {[
                "Cetak halaman QR ini dan tempel di area kasir atau cermin.",
                "Member login ke aplikasi, lalu buka halaman Check-in.",
                "Member tekan tombol Scan QR dan arahkan kamera ke QR ini.",
                "Kunjungan langsung tercatat otomatis setelah QR terbaca.",
              ].map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-2.5 text-[12px] leading-relaxed text-muted"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-[10px] font-bold text-accent">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Card>

          <Card className="animate-rise overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-4">
              <Smartphone className="size-4 text-accent" />
              <h2 className="text-[13px] font-bold text-ink">Tips</h2>
            </div>
            <ul className="space-y-2.5 p-5 text-[11px] leading-relaxed text-muted">
              <li className="flex gap-2">
                <Info className="mt-0.5 size-3.5 shrink-0 text-accent" />
                {CHECKIN_COOLDOWN_HOURS > 0
                  ? `Check-in dibatasi 1 kali per ${CHECKIN_COOLDOWN_HOURS / 24} hari untuk mencegah pencatatan ganda.`
                  : "Setiap scan QR langsung mencatat 1 kunjungan. Pastikan hanya discan setelah cukur dan pembayaran diterima."}
              </li>
              <li className="flex gap-2">
                <Info className="mt-0.5 size-3.5 shrink-0 text-accent" />
                Check-in hanya bisa dilakukan pada jam operasional 08.00–22.00
                WIB.
              </li>
              <li className="flex gap-2">
                <Info className="mt-0.5 size-3.5 shrink-0 text-accent" />
                Untuk produksi, atur{" "}
                <span className="font-mono text-ink">NEXT_PUBLIC_APP_URL</span>{" "}
                agar QR menunjuk domain yang benar.
              </li>
              <li className="flex gap-2">
                <Info className="mt-0.5 size-3.5 shrink-0 text-bad" />
                QR ini statis. Jangan bagikan fotonya. Jika bocor, ganti{" "}
                <span className="font-mono text-ink">CHECKIN_QR_SECRET</span>{" "}
                lalu cetak ulang QR.
              </li>
            </ul>
          </Card>

          <Card className="animate-rise flex items-center gap-3 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
              <QrCode className="size-5" />
            </span>
            <p className="text-[11px] leading-relaxed text-muted">
              QR yang sama dapat dipakai untuk semua member. Identitas member
              ditentukan dari sesi login, bukan dari QR.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
