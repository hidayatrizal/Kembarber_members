import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck2,
  Clock,
  QrCode,
  ScanLine,
  Scissors,
  Ticket,
} from "lucide-react";
import { CheckinScanner } from "@/components/checkin-scanner";
import { Badge, ProgressBar } from "@/components/ui";
import {
  CHECKIN_COOLDOWN_HOURS,
  SHOP_CLOSE_HOUR,
  SHOP_OPEN_HOUR,
} from "@/lib/config";
import { requireMember } from "@/lib/auth";
import { verifyCheckinToken } from "@/lib/checkin-token";
import {
  getCooldownStatus,
  getMemberStats,
  getMemberVisits,
} from "@/lib/loyalty";
import { formatDateTime, isShopOpen } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Check-in Cukur" };

export default async function CheckinPage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string }>;
}) {
  const member = await requireMember("/checkin");
  const { k } = await searchParams;
  const initialToken = k && verifyCheckinToken(k) ? k : undefined;
  const invalidToken = Boolean(k) && !initialToken;
  const [stats, visits] = await Promise.all([
    getMemberStats(member.id),
    getMemberVisits(member.id),
  ]);

  const lastPaid = visits.find((visit) => !visit.isFree);
  const { active: cooldownActive, nextAllowedAt: nextAllowed } =
    getCooldownStatus(lastPaid?.visitedAt ?? null);
  const open = isShopOpen();
  const canCheckin = open && !cooldownActive;

  return (
    <div className="space-y-6">
      <header className="animate-rise">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
          Check-in
        </p>
        <h1 className="mt-1 text-balance font-display text-[clamp(2rem,9vw,2.6rem)] leading-[0.98] tracking-[-0.02em] text-ink">
          Catat kunjungan cukur.
        </h1>
        <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
          Setelah cukur selesai dan sudah dibayar, scan QR di barbershop untuk
          mencatat kunjungan. Setiap kunjungan berbayar menambah satu poin.
        </p>
      </header>

      <section className="animate-rise overflow-hidden rounded-[28px] border border-line bg-surface shadow-[var(--shadow-card)]">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <Badge tone={open ? "good" : "bad"}>
              {open ? "Toko buka" : "Toko tutup"}
            </Badge>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              {String(SHOP_OPEN_HOUR).padStart(2, "0")}.00–
              {String(SHOP_CLOSE_HOUR).padStart(2, "0")}.00 WIB
            </span>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <span
              className={cn(
                "grid size-16 shrink-0 place-items-center rounded-[22px] transition-colors",
                canCheckin
                  ? "bg-accent text-black shadow-[0_0_24px_rgba(30,215,96,0.25)]"
                  : "bg-paper-deep text-muted",
              )}
            >
              <ScanLine className="size-7" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[1.9rem] leading-none tracking-[-0.01em] text-ink">
                {canCheckin
                  ? "Siap check-in"
                  : cooldownActive
                    ? "Masih jeda"
                    : "Di luar jam"}
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">
                {canCheckin
                  ? "Tekan tombol scan dan arahkan kamera ke QR di barbershop."
                  : cooldownActive && nextAllowed
                    ? `Kunjungan berikutnya bisa dicatat mulai ${formatDateTime(nextAllowed)}.`
                    : `Check-in tersedia pukul ${String(SHOP_OPEN_HOUR).padStart(2, "0")}.00–${String(SHOP_CLOSE_HOUR).padStart(2, "0")}.00 WIB.`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-line bg-paper/60 px-5 py-3 text-[10px] font-medium text-muted">
          <QrCode className="size-3.5 text-accent" />
          Tombol scan akan membuka kamera untuk membaca QR di barbershop.
        </div>
      </section>

      <section className="animate-rise rounded-[26px] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="size-4 text-accent" />
            <p className="text-[13px] font-bold text-ink">Progress kamu</p>
          </div>
          <span className="text-[13px] font-bold tabular-nums text-accent">
            {stats.progress}
            <span className="text-muted">/{stats.target}</span>
          </span>
        </div>
        <ProgressBar value={stats.progress} max={stats.target} className="mt-3.5" />
        <p className="mt-3 text-[12px] leading-relaxed text-muted">
          {stats.hasRewardReady
            ? "Kamu punya reward cukur gratis. Tukarkan ke kasir sebelum check-in berikutnya."
            : `Sisa ${stats.remaining} cukur berbayar menuju cukur gratis berikutnya.`}
        </p>
      </section>

      <div className="animate-rise">
        <CheckinScanner
          initialToken={initialToken}
          invalidToken={invalidToken}
          disabled={!canCheckin}
          disabledReason={
            cooldownActive && nextAllowed
              ? `Kunjungan berikutnya bisa dicatat mulai ${formatDateTime(nextAllowed)}.`
              : `Check-in tersedia pukul ${String(SHOP_OPEN_HOUR).padStart(2, "0")}.00–${String(SHOP_CLOSE_HOUR).padStart(2, "0")}.00 WIB.`
          }
        />
      </div>

      <section className="animate-rise divide-y divide-line overflow-hidden rounded-[26px] border border-line bg-surface">
        <RuleRow
          icon={<Clock className="size-4" />}
          title="Jam operasional"
          description={`Check-in hanya bisa dilakukan pukul ${String(SHOP_OPEN_HOUR).padStart(2, "0")}.00–${String(SHOP_CLOSE_HOUR).padStart(2, "0")}.00 WIB.`}
        />
        <RuleRow
          icon={<CalendarCheck2 className="size-4" />}
          title="Jeda kunjungan"
          description={`Maksimal satu check-in per ${CHECKIN_COOLDOWN_HOURS / 24} hari untuk mencegah pencatatan ganda.`}
        />
        <RuleRow
          icon={<Scissors className="size-4" />}
          title="Hanya kunjungan berbayar"
          description="Cukur gratis dari reward tidak menambah poin loyalitas baru."
        />
      </section>

      <Link
        href="/profil"
        className="flex items-center justify-between rounded-[26px] border border-line bg-surface px-5 py-4 shadow-[var(--shadow-card)] transition-transform active:scale-[0.99]"
      >
        <div>
          <p className="text-[12px] font-semibold text-ink">
            Total {stats.totalVisits} kunjungan tercatat
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            Lihat kartu dan riwayat lengkapmu.
          </p>
        </div>
        <span className="text-[11px] font-bold text-accent">Buka kartu</span>
      </Link>
    </div>
  );
}

function RuleRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-paper-deep text-ink-soft">
        {icon}
      </span>
      <div>
        <p className="text-[12px] font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
          {description}
        </p>
      </div>
    </div>
  );
}
