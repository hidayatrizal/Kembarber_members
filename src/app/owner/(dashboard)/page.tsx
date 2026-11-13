import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Gift,
  Scissors,
  Ticket,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { Avatar, Badge, ProgressBar, buttonClass } from "@/components/ui";
import { formatDate, formatDateTime, initials } from "@/lib/utils";
import { getPendingRewards } from "@/lib/loyalty";
import { getOwnerOverview } from "@/lib/owner-queries";

export const metadata: Metadata = { title: "Dashboard Owner" };

export default async function OwnerDashboardPage() {
  const [overview, pending] = await Promise.all([
    getOwnerOverview(),
    getPendingRewards(6),
  ]);

  return (
    <div className="space-y-6">
      <header className="animate-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
            {formatDate(new Date())}
          </p>
          <h1 className="mt-1 text-balance font-display text-[clamp(2rem,8vw,2.6rem)] leading-[0.98] tracking-[-0.02em] text-ink">
            Ringkasan loyalitas.
          </h1>
          <p className="mt-2 text-[13px] text-muted">
            Pantau member, kunjungan, dan reward Kembabershop.
          </p>
        </div>
        <Link href="/owner/member" className={buttonClass("secondary", "md")}>
          <Users className="size-4" /> Lihat member
        </Link>
      </header>

      <div className="animate-rise grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <Metric
          label="Total member"
          value={overview.totalMembers}
          hint={`+${overview.newMembersThisMonth} bulan ini`}
          icon={<Users className="size-4" />}
        />
        <Metric
          label="Cukur berbayar"
          value={overview.paidVisits}
          hint={`${overview.monthVisits} kunjungan bulan ini`}
          icon={<Scissors className="size-4" />}
        />
        <Metric
          label="Reward tersedia"
          value={overview.availableRewards}
          hint="Siap dipakai member"
          icon={<Ticket className="size-4" />}
          accent
        />
        <Metric
          label="Reward terpakai"
          value={overview.redeemedRewards}
          hint={`${overview.freeVisits} cukur gratis`}
          icon={<Gift className="size-4" />}
        />
      </div>

      <div className="animate-rise grid grid-cols-3 divide-x divide-line rounded-[26px] border border-line bg-surface py-4 shadow-[var(--shadow-card)]">
        <MiniStat
          icon={<CalendarDays className="size-3.5" />}
          label="Hari ini"
          value={overview.todayVisits}
        />
        <MiniStat
          icon={<TrendingUp className="size-3.5" />}
          label="Bulan ini"
          value={overview.monthVisits}
        />
        <MiniStat
          icon={<UserPlus className="size-3.5" />}
          label="Member baru"
          value={overview.newMembersThisMonth}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Reward siap dipakai"
          subtitle="Member dengan cukur gratis"
          icon={<Gift className="size-4" />}
          href="/owner/member"
        >
          {pending.length === 0 ? (
            <PanelEmpty text="Belum ada reward aktif. Reward muncul setelah member menyelesaikan 5 cukur berbayar." />
          ) : (
            pending.map((reward) => (
              <Link
                key={reward.id}
                href={`/owner/member/${reward.memberId}`}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2"
              >
                <Avatar
                  initials={initials(reward.memberName)}
                  className="size-9 text-[11px]"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-ink">
                    {reward.memberName}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    Siklus {reward.cycle} · {formatDate(reward.earnedAt)}
                  </p>
                </div>
                <Badge tone="accent">Siap</Badge>
              </Link>
            ))
          )}
        </Panel>

        <Panel
          title="Mendekati hadiah"
          subtitle="Sisa 1–2 cukur menuju reward"
          icon={<TrendingUp className="size-4" />}
          href="/owner/member"
        >
          {overview.nearReward.length === 0 ? (
            <PanelEmpty text="Belum ada member yang mendekati hadiah." />
          ) : (
            overview.nearReward.map((member) => (
              <Link
                key={member.id}
                href={`/owner/member/${member.id}`}
                className="block px-4 py-3.5 transition-colors hover:bg-surface-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[12px] font-semibold text-ink">
                    {member.name}
                  </p>
                  <span className="text-[11px] font-bold tabular-nums text-accent">
                    {member.stats.progress}/{member.stats.target}
                  </span>
                </div>
                <ProgressBar
                  value={member.stats.progress}
                  max={member.stats.target}
                  className="mt-2 h-1.5"
                />
                <p className="mt-1.5 text-[10px] text-muted">
                  Sisa {member.stats.target - member.stats.progress} cukur lagi
                </p>
              </Link>
            ))
          )}
        </Panel>

        <Panel
          title="Aktivitas terbaru"
          subtitle="Kunjungan terakhir member"
          icon={<Scissors className="size-4" />}
        >
          {overview.recentVisits.length === 0 ? (
            <PanelEmpty text="Belum ada kunjungan tercatat." />
          ) : (
            overview.recentVisits.map((visit) => (
              <div
                key={visit.id}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper-deep text-ink-soft">
                  {visit.isFree ? (
                    <Gift className="size-4" />
                  ) : (
                    <Scissors className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-ink">
                    {visit.memberName}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    {formatDateTime(visit.visitedAt)}
                  </p>
                </div>
                <Badge tone={visit.isFree ? "accent" : "good"}>
                  {visit.isFree ? "Gratis" : "+1"}
                </Badge>
              </div>
            ))
          )}
        </Panel>

        <Panel
          title="Member paling loyal"
          subtitle="Berdasarkan total cukur berbayar"
          icon={<Users className="size-4" />}
          href="/owner/member"
        >
          {overview.topLoyal.length === 0 ? (
            <PanelEmpty text="Belum ada member terdaftar." />
          ) : (
            overview.topLoyal.map((member) => (
              <Link
                key={member.id}
                href={`/owner/member/${member.id}`}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2"
              >
                <Avatar
                  initials={initials(member.name)}
                  className="size-9 text-[11px]"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-ink">
                    {member.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    {member.stats.paidVisits} cukur berbayar
                  </p>
                </div>
                <ArrowUpRight className="size-4 text-muted/60" />
              </Link>
            ))
          )}
        </Panel>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "rounded-[24px] border border-accent/20 bg-accent-soft/50 p-4"
          : "rounded-[24px] border border-line bg-surface p-4 shadow-[var(--shadow-card)]"
      }
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[9px] font-bold uppercase leading-relaxed tracking-[0.14em] text-muted">
          {label}
        </p>
        <span
          className={
            accent
              ? "grid size-8 shrink-0 place-items-center rounded-full bg-surface text-accent"
              : "grid size-8 shrink-0 place-items-center rounded-full bg-paper-deep text-ink-soft"
          }
        >
          {icon}
        </span>
      </div>
      <p className="mt-4 font-display text-[2rem] leading-none tabular-nums text-ink">
        {value}
      </p>
      <p className="mt-2 text-[10px] text-muted">{hint}</p>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="px-3 text-center">
      <span className="mx-auto grid size-7 place-items-center rounded-full bg-paper-deep text-accent">
        {icon}
      </span>
      <p className="mt-2 font-display text-[1.5rem] leading-none tabular-nums text-ink">
        {value}
      </p>
      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.1em] text-muted">
        {label}
      </p>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  icon,
  href,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="animate-rise overflow-hidden rounded-[26px] border border-line bg-surface shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-paper-deep text-accent">
            {icon}
          </span>
          <div>
            <h2 className="text-[13px] font-bold text-ink">{title}</h2>
            <p className="mt-0.5 text-[10px] text-muted">{subtitle}</p>
          </div>
        </div>
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-accent"
          >
            Semua <ChevronRight className="size-3" />
          </Link>
        ) : null}
      </div>
      <div className="divide-y divide-line">{children}</div>
    </section>
  );
}

function PanelEmpty({ text }: { text: string }) {
  return (
    <p className="px-5 py-8 text-center text-[11px] leading-relaxed text-muted">
      {text}
    </p>
  );
}
