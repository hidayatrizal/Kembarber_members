import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Gift,
  Scissors,
  Ticket,
} from "lucide-react";
import { ConfirmRedeemButton } from "@/components/confirm-redeem-button";
import { DeleteMemberButton } from "@/components/delete-member-button";
import { Avatar, Badge, Card, EmptyState, ProgressBar } from "@/components/ui";
import {
  deleteMemberAction,
  redeemRewardAction,
} from "@/lib/actions/owner";
import { getMemberDetail } from "@/lib/owner-queries";
import { formatDate, formatDateTime, formatPhone, initials } from "@/lib/utils";

export const metadata: Metadata = { title: "Detail Member" };

export default async function MemberDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ redeem?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const detail = await getMemberDetail(id);

  if (!detail) notFound();

  const { member, stats, visits, rewards } = detail;
  const available = rewards.filter((reward) => reward.status === "available");
  const redeemed = rewards.filter((reward) => reward.status === "redeemed");

  return (
    <div className="space-y-6">
      <Link
        href="/owner/member"
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" /> Kembali ke database
      </Link>

      {query.redeem === "sukses" ? (
        <div className="rounded-2xl border border-accent/15 bg-accent-soft px-4 py-3 text-[12px] font-medium text-accent">
          Reward berhasil ditandai sudah dipakai.
        </div>
      ) : null}
      {query.redeem === "gagal" ? (
        <div className="rounded-2xl border border-bad/20 bg-bad-soft px-4 py-3 text-[12px] font-medium text-bad">
          Reward tidak dapat diproses. Mungkin sudah dipakai sebelumnya.
        </div>
      ) : null}

      <section className="animate-rise rounded-[1.75rem] border border-white/5 bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-4">
          <Avatar
            initials={initials(member.name)}
            className="size-14 text-[15px]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[1.4rem] font-bold tracking-[-0.02em] text-ink">
                {member.name}
              </h1>
              {stats.hasRewardReady ? (
                <Badge tone="gold">
                  <Ticket className="size-2.5" /> Reward siap
                </Badge>
              ) : (
                <Badge tone="muted">
                  <BadgeCheck className="size-2.5" /> Aktif
                </Badge>
              )}
            </div>
            <p className="mt-1 text-[12px] text-muted">
              {formatPhone(member.phone)}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
              KB-{member.id.slice(0, 6)}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
            Member sejak
          </p>
          <p className="text-[12px] font-semibold text-ink">
            {formatDate(member.createdAt)}
          </p>
        </div>
      </section>

      <div className="animate-rise grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatCard
          label="Cukur berbayar"
          value={stats.paidVisits}
          icon={<Scissors className="size-4" />}
        />
        <StatCard
          label="Cukur gratis"
          value={stats.freeVisits}
          icon={<Gift className="size-4" />}
        />
        <StatCard
          label="Reward tersedia"
          value={stats.rewardsAvailable}
          icon={<Ticket className="size-4" />}
          accent={stats.rewardsAvailable > 0}
        />
        <StatCard
          label="Reward terpakai"
          value={stats.rewardsRedeemed}
          icon={<CheckCircle2 className="size-4" />}
        />
      </div>

      <Card className="animate-rise p-5">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-bold text-ink">Progress loyalitas</p>
          <span className="text-[13px] font-bold tabular-nums text-accent">
            {stats.progress}
            <span className="text-muted">/{stats.target}</span>
          </span>
        </div>
        <ProgressBar
          value={stats.progress}
          max={stats.target}
          className="mt-3.5"
        />
        <p className="mt-3 text-[11px] leading-relaxed text-muted">
          {stats.hasRewardReady
            ? "Member memiliki reward cukur gratis. Reward otomatis terpakai saat member scan QR untuk cukur gratis."
            : `Sisa ${stats.remaining} cukur berbayar menuju reward berikutnya.`}
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="animate-rise overflow-hidden rounded-[1.75rem] border border-white/5 bg-surface shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-white/5 px-5 py-4">
            <CalendarDays className="size-4 text-accent" />
            <h2 className="text-[13px] font-bold text-ink">
              Riwayat kunjungan
            </h2>
          </div>
          {visits.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="Belum ada kunjungan"
                description="Member belum pernah check-in."
              />
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {visits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center gap-3 px-4 py-3.5"
                >
                  <span
                    className={
                      visit.isFree
                        ? "grid size-9 shrink-0 place-items-center rounded-full bg-gold-soft text-gold"
                        : "grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-ink-soft"
                    }
                  >
                    {visit.isFree ? (
                      <Gift className="size-4" />
                    ) : (
                      <Scissors className="size-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-ink">
                      {visit.isFree ? "Cukur gratis (reward)" : "Cukur berbayar"}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted">
                      {formatDateTime(visit.visitedAt)}
                    </p>
                  </div>
                  <Badge tone={visit.isFree ? "gold" : "good"}>
                    {visit.isFree ? "Reward" : "+1 poin"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-4">
          <section className="animate-rise overflow-hidden rounded-[1.75rem] border border-white/5 bg-surface shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-4">
              <Ticket className="size-4 text-accent" />
              <h2 className="text-[13px] font-bold text-ink">
                Reward tersedia
              </h2>
            </div>
            <div className="space-y-2 p-4">
              {available.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-line-strong px-3 py-5 text-center text-[11px] text-muted">
                  Tidak ada reward aktif.
                </p>
              ) : (
                available.map((reward) => (
                  <div
                    key={reward.id}
                    className="rounded-2xl border border-accent/20 bg-accent-soft p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[12px] font-bold text-accent">
                          Cukur gratis · Siklus {reward.cycle}
                        </p>
                        <p className="mt-0.5 text-[10px] text-accent/70">
                          Didapat {formatDate(reward.earnedAt)}
                        </p>
                      </div>
                      <Gift className="size-4 shrink-0 text-accent" />
                    </div>
                    <p className="mt-2 text-[9px] leading-relaxed text-accent/70">
                      Normalnya member scan QR sendiri. Gunakan tombol manual
                      hanya jika QR gagal.
                    </p>
                    <form action={redeemRewardAction} className="mt-3">
                      <input type="hidden" name="rewardId" value={reward.id} />
                      <input type="hidden" name="memberId" value={member.id} />
                      <ConfirmRedeemButton />
                    </form>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="animate-rise overflow-hidden rounded-[1.75rem] border border-white/5 bg-surface shadow-[var(--shadow-card)]">
            <div className="border-b border-white/5 px-5 py-4">
              <h2 className="text-[13px] font-bold text-ink">
                Reward terpakai
              </h2>
            </div>
            <div className="divide-y divide-white/5">
              {redeemed.length === 0 ? (
                <p className="px-4 py-6 text-center text-[11px] text-muted">
                  Belum ada reward terpakai.
                </p>
              ) : (
                redeemed.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center gap-2.5 px-4 py-3.5"
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-ink">
                        Siklus {reward.cycle}
                      </p>
                      <p className="text-[10px] text-muted">
                        {reward.redeemedAt
                          ? `Dipakai ${formatDateTime(reward.redeemedAt)}`
                          : "Sudah dipakai"}
                      </p>
                      {reward.redeemedBy ? (
                        <p className="mt-0.5 text-[9px] text-muted/80">
                          {reward.redeemedBy === "Scan QR member"
                            ? "Via scan QR"
                            : `Oleh ${reward.redeemedBy}`}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <section className="animate-rise rounded-[1.75rem] border border-bad/20 bg-bad-soft/40 p-5">
        <p className="text-[13px] font-bold text-bad">Zona berbahaya</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          Menghapus akun ini juga menghapus permanen seluruh riwayat kunjungan
          dan reward member. Tindakan ini tidak bisa dibatalkan.
        </p>
        <form action={deleteMemberAction} className="mt-4">
          <input type="hidden" name="memberId" value={member.id} />
          <DeleteMemberButton memberName={member.name} />
        </form>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "rounded-2xl border border-accent/20 bg-accent-soft p-4"
          : "rounded-2xl border border-white/5 bg-surface p-4"
      }
    >
      <span
        className={
          accent
            ? "grid size-8 place-items-center rounded-full bg-surface text-accent"
            : "grid size-8 place-items-center rounded-full bg-surface-2 text-muted"
        }
      >
        {icon}
      </span>
      <p className="mt-3 text-[1.8rem] font-bold leading-none tabular-nums text-ink">
        {value}
      </p>
      <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
    </div>
  );
}
