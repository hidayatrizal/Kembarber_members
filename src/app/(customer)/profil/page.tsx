import type { Metadata } from "next";
import Link from "next/link";
import {
  Bell,
  Check,
  Clock,
  Gift,
  History,
  MapPin,
  Plus,
  ScanLine,
  UserRound,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { Avatar, Badge, ProgressBar } from "@/components/ui";
import { requireMember } from "@/lib/auth";
import { getMemberStats } from "@/lib/loyalty";
import { cn, initials, isShopOpen } from "@/lib/utils";

export const metadata: Metadata = { title: "Kartu Member" };

type SearchParams = {
  selamat?: string;
  checkin?: string;
  reward?: string;
  cycle?: string;
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const member = await requireMember("/profil");
  const params = await searchParams;
  const stats = await getMemberStats(member.id);

  const firstName = member.name.trim().split(/\s+/)[0];
  const memberCode = `KB-${member.id.slice(0, 6).toUpperCase()}`;
  const open = isShopOpen();
  const target = stats.target;

  const stamps = Array.from({ length: target }, (_, index) => {
    const number = index + 1;
    const done = number <= stats.progress;
    const active =
      !stats.hasRewardReady && number === stats.progress + 1;
    return { number, done, active, reward: false };
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            initials={initials(member.name)}
            className="size-12 border border-white/10 bg-surface-3"
          />
          <p className="truncate text-[15px] font-semibold leading-tight text-ink">
            Hi, {firstName}
          </p>
        </div>
        <div className="flex shrink-0 gap-2.5">
          <Link
            href="/riwayat?tab=reward"
            aria-label="Lihat reward"
            className="relative grid size-10 place-items-center rounded-full border border-white/5 bg-surface text-ink"
          >
            <Bell className="size-4" />
            {stats.hasRewardReady ? (
              <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-red-500" />
            ) : null}
          </Link>
          <Link
            href="/checkin"
            aria-label="Check-in cukur"
            className="grid size-10 place-items-center rounded-full bg-accent text-black shadow-[0_0_18px_rgba(30,215,96,0.35)]"
          >
            <Plus className="size-5" strokeWidth={3} />
          </Link>
        </div>
      </header>

      {params.selamat || params.checkin === "sukses" ? (
        <div className="animate-rise flex items-start gap-2.5 rounded-2xl border border-accent/15 bg-accent-soft px-4 py-3 text-[12px] font-medium leading-relaxed text-accent">
          <Check className="mt-0.5 size-4 shrink-0" />
          <p>
            {params.selamat
              ? "Kartu member berhasil dibuat."
              : params.reward === "used"
                ? `Cukur gratis tercatat.${stats.hasRewardReady ? ` ${stats.rewardsAvailable} reward tersisa.` : ` Progress 0/${target}.`}`
                : params.reward === "earned"
                  ? "1 cukur gratis didapat."
                  : `Kunjungan tercatat. Sisa ${stats.remaining} cukur.`}
          </p>
        </div>
      ) : null}

      <section className="animate-rise relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-surface-3 via-surface-2 to-surface p-5 shadow-[var(--shadow-lift)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-accent/20 blur-3xl"
        />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Brand showText={false} />
            <p className="text-[11px] font-bold text-ink">Kembabershop</p>
          </div>
          <Badge tone={stats.hasRewardReady ? "gold" : "muted"}>
            {stats.hasRewardReady
              ? `${stats.rewardsAvailable} reward`
              : "Aktif"}
          </Badge>
        </div>

        <div className="relative mt-6">
          <p className="font-display text-[1.55rem] leading-none text-ink">
            {member.name}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            {memberCode}
          </p>
        </div>

        <div className="relative mt-5 flex items-end justify-between gap-3">
          <p className="text-[13px] font-bold text-ink">
            {stats.progress}/{target} cukur
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em]",
              stats.hasRewardReady
                ? "bg-gold-soft text-gold"
                : "bg-accent-soft text-accent",
            )}
          >
            {stats.hasRewardReady ? (
              <>
                <Gift className="size-3" /> {stats.rewardsAvailable} gratis
              </>
            ) : (
              `${stats.remaining} lagi`
            )}
          </span>
        </div>

        <ProgressBar
          value={stats.progress}
          max={target}
          className="relative mt-2"
        />
      </section>

      <div className="animate-rise flex items-center justify-between rounded-2xl border border-white/5 bg-surface p-4">
        <div className="flex min-w-0 items-center gap-3">
          <MapPin className="size-5 shrink-0 text-accent" />
          <p className="truncate text-[12px] font-semibold text-ink">
            Kembabershop Pusat
          </p>
        </div>
        <Badge tone={open ? "good" : "bad"}>{open ? "Buka" : "Tutup"}</Badge>
      </div>

      <section className="animate-rise">
        <div className="grid grid-cols-4 gap-2.5">
          <QuickAction
            href="/checkin"
            label="Check-in"
            icon={<ScanLine className="size-6" />}
            active
          />
          <QuickAction
            href="/riwayat"
            label="Riwayat"
            icon={<History className="size-6" />}
          />
          <QuickAction
            href="/riwayat?tab=reward"
            label="Reward"
            icon={<Gift className="size-6" />}
          />
          <QuickAction
            href="/akun"
            label="Akun"
            icon={<UserRound className="size-6" />}
          />
        </div>
      </section>

      <section className="animate-rise">
        <h2 className="mb-4 text-[1.15rem] font-bold text-ink">Reward</h2>
        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {stamps.map((stamp) => (
            <Stamp key={stamp.number} {...stamp} label="Cukur" />
          ))}
          <Stamp
            number={target + 1}
            done={false}
            active={stats.hasRewardReady}
            reward
            label="Gratis"
          />
        </div>
      </section>

      <div className="flex items-center justify-center gap-1.5 pb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted/60">
        <Clock className="size-3.5" /> {stats.totalVisits} kunjungan
      </div>
    </div>
  );
}

function QuickAction({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-[1.25rem] py-4 transition-colors active:scale-[0.98]",
        active
          ? "bg-accent text-black shadow-[0_4px_20px_rgba(30,215,96,0.2)]"
          : "border border-white/5 bg-surface text-gray-300",
      )}
    >
      {icon}
      <span
        className={cn(
          "text-[10px] font-semibold",
          active ? "text-black" : "text-gray-400",
        )}
      >
        {label}
      </span>
    </Link>
  );
}

function Stamp({
  number,
  label,
  done,
  active,
  reward,
}: {
  number: number;
  label: string;
  done: boolean;
  active: boolean;
  reward: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-[4.25rem] shrink-0 flex-col items-center justify-center rounded-2xl border py-3.5",
        active && reward
          ? "border-amber-500 bg-gradient-to-br from-yellow-400 to-amber-600 text-black"
          : active
            ? "border-accent bg-accent text-black shadow-[0_4px_20px_rgba(30,215,96,0.2)]"
            : done
              ? "border-white/10 bg-surface-3 text-white"
              : "border-white/5 bg-paper-deep text-gray-500",
      )}
    >
      <span className="grid size-6 place-items-center">
        {done ? (
          <Check className="size-6" strokeWidth={3} />
        ) : reward ? (
          <Gift className="size-6" />
        ) : (
          <span className="text-lg font-bold">{String(number).padStart(2, "0")}</span>
        )}
      </span>
      <span
        className={cn(
          "mt-1 text-[10px] font-semibold",
          active ? "text-black/80" : done ? "text-white" : "text-gray-500",
        )}
      >
        {label}
      </span>
    </div>
  );
}
