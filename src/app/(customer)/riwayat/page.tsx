import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Gift,
  History,
  Scissors,
  Ticket,
} from "lucide-react";
import { Badge, EmptyState, buttonClass } from "@/components/ui";
import { requireMember } from "@/lib/auth";
import {
  getMemberRewards,
  getMemberStats,
  getMemberVisits,
} from "@/lib/loyalty";
import {
  cn,
  formatDate,
  formatDateTime,
  formatMonthYear,
} from "@/lib/utils";

export const metadata: Metadata = { title: "Riwayat Cukur" };

type SearchParams = { tab?: string };

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const member = await requireMember("/riwayat");
  const params = await searchParams;
  const tab = params.tab === "reward" ? "reward" : "kunjungan";

  const [visits, rewards, stats] = await Promise.all([
    getMemberVisits(member.id),
    getMemberRewards(member.id),
    getMemberStats(member.id),
  ]);

  const available = rewards.filter((r) => r.status === "available");
  const redeemed = rewards.filter((r) => r.status === "redeemed");

  const grouped = new Map<string, typeof visits>();
  for (const visit of visits) {
    const key = formatMonthYear(visit.visitedAt);
    const bucket = grouped.get(key);
    if (bucket) bucket.push(visit);
    else grouped.set(key, [visit]);
  }

  return (
    <div className="space-y-6">
      <header className="animate-rise">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
          Aktivitas
        </p>
        <h1 className="mt-1 text-balance font-display text-[clamp(2rem,9vw,2.6rem)] leading-[0.98] tracking-[-0.02em] text-ink">
          Riwayat & reward.
        </h1>
        <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
          Semua kunjungan dan hadiah loyalitasmu tersimpan di sini.
        </p>
      </header>

      <div className="animate-rise grid grid-cols-2 gap-1 rounded-full border border-line bg-paper-deep/60 p-1">
        <Segment
          href="/riwayat"
          active={tab === "kunjungan"}
          label="Kunjungan"
          count={visits.length}
        />
        <Segment
          href="/riwayat?tab=reward"
          active={tab === "reward"}
          label="Reward"
          count={rewards.length}
        />
      </div>

      {tab === "kunjungan" ? (
        visits.length === 0 ? (
          <EmptyState
            icon={<Scissors className="size-6" />}
            title="Belum ada kunjungan"
            description="Scan QR di barbershop setelah cukur untuk mencatat kunjungan pertamamu."
          />
        ) : (
          <div className="space-y-5">
            {Array.from(grouped.entries()).map(([month, items]) => (
              <section key={month}>
                <div className="mb-2 flex items-baseline justify-between">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                    {month}
                  </h2>
                  <span className="text-[10px] text-muted">
                    {items.length} kunjungan
                  </span>
                </div>
                <div className="animate-rise divide-y divide-line overflow-hidden rounded-[26px] border border-line bg-surface shadow-[var(--shadow-card)]">
                  {items.map((visit) => (
                    <div key={visit.id} className="flex items-center gap-3 px-4 py-3.5">
                      <span
                        className={
                          visit.isFree
                            ? "grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent"
                            : "grid size-9 shrink-0 place-items-center rounded-full bg-paper-deep text-ink-soft"
                        }
                      >
                        {visit.isFree ? (
                          <Gift className="size-4" />
                        ) : (
                          <Scissors className="size-4" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-semibold text-ink">
                          {visit.isFree ? "Cukur gratis" : "Cukur berbayar"}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted">
                          {formatDateTime(visit.visitedAt)}
                        </p>
                      </div>
                      <Badge tone={visit.isFree ? "accent" : "good"}>
                        {visit.isFree ? "Reward" : "+1 poin"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )
      ) : rewards.length === 0 ? (
        <EmptyState
          icon={<Gift className="size-6" />}
          title="Belum ada reward"
          description={`Kumpulkan ${stats.target} cukur berbayar untuk mendapatkan satu cukur gratis.`}
        />
      ) : (
        <div className="space-y-4">
          {available.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                Siap dipakai
              </h2>
              {available.map((reward) => (
                <div
                  key={reward.id}
                  className="animate-rise relative overflow-hidden rounded-[26px] border border-accent/25 bg-surface shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-start justify-between gap-3 p-5 pb-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent">
                        Reward siap dipakai
                      </p>
                      <p className="mt-1 font-display text-[1.8rem] leading-none text-ink">
                        Cukur gratis
                      </p>
                      <p className="mt-1.5 text-[11px] text-muted">
                        Siklus {reward.cycle} · didapat{" "}
                        {formatDate(reward.earnedAt)}
                      </p>
                    </div>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                      <Ticket className="size-5" />
                    </span>
                  </div>
                  <div className="relative border-t border-dashed border-line-strong px-5 py-3">
                    <span className="absolute -left-2.5 -top-2.5 size-5 rounded-full bg-paper" />
                    <span className="absolute -right-2.5 -top-2.5 size-5 rounded-full bg-paper" />
                    <p className="text-[11px] leading-relaxed text-muted">
                      Scan QR di barbershop saat cukur gratis. Reward otomatis
                      ditandai terpakai dan progress kembali ke 0/5.
                    </p>
                  </div>
                </div>
              ))}
            </section>
          ) : null}

          {redeemed.length > 0 ? (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                Sudah terpakai
              </h2>
              <div className="divide-y divide-line overflow-hidden rounded-[26px] border border-line bg-surface">
                {redeemed.map((reward) => (
                  <div key={reward.id} className="flex items-center gap-3 px-4 py-3.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper-deep text-muted">
                      <CheckCircle2 className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold text-ink">
                        Cukur gratis · Siklus {reward.cycle}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {reward.redeemedAt
                          ? `Dipakai ${formatDateTime(reward.redeemedAt)}`
                          : "Sudah dipakai"}
                      </p>
                      {reward.redeemedBy ? (
                        <p className="mt-0.5 text-[10px] text-muted/80">
                          {reward.redeemedBy === "Scan QR member"
                            ? "Via scan QR"
                            : `Oleh ${reward.redeemedBy}`}
                        </p>
                      ) : null}
                    </div>
                    <Badge tone="muted">Terpakai</Badge>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}

      <Link href="/checkin" className={buttonClass("primary", "lg", "w-full")}>
        <Scissors className="size-4" /> Check-in kunjungan baru
      </Link>

      <div className="flex items-center justify-center gap-1.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted/70">
        <History className="size-3.5" /> {stats.totalVisits} kunjungan tercatat
      </div>
    </div>
  );
}

function Segment({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-9 items-center justify-center gap-1.5 rounded-full text-[12px] font-semibold transition-colors",
        active ? "bg-accent text-black" : "text-muted hover:text-ink",
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[9px] font-bold tabular-nums",
          active ? "bg-black/15 text-black" : "bg-surface-2 text-muted",
        )}
      >
        {count}
      </span>
    </Link>
  );
}
