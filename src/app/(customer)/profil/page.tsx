import type { Metadata } from "next";
import Link from "next/link";
import {
  Bell,
  Check,
  ChevronRight,
  Clock,
  Gift,
  History,
  MapPin,
  ScanLine,
  UserRound,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { Avatar, Badge, ProgressBar } from "@/components/ui";
import { requireMember } from "@/lib/auth";
import { SHOP_CLOSE_HOUR, SHOP_OPEN_HOUR } from "@/lib/config";
import { getMemberStats } from "@/lib/loyalty";
import { cn, initials, isShopOpen } from "@/lib/utils";

export const metadata: Metadata = { title: "Beranda" };

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
  const hours = `${String(SHOP_OPEN_HOUR).padStart(2, "0")}.00–${String(
    SHOP_CLOSE_HOUR,
  ).padStart(2, "0")}.00`;

  const stamps = Array.from({ length: target }, (_, index) => {
    const number = index + 1;
    const done = number <= stats.progress;
    const active = !stats.hasRewardReady && number === stats.progress + 1;
    return { number, done, active, reward: false };
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3 pt-1">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            initials={initials(member.name)}
            className="size-11 border border-white/10 bg-surface-3"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted">
              Selamat datang kembali
            </p>
            <p className="truncate text-[18px] font-bold leading-tight text-ink">
              Halo, {firstName}
            </p>
          </div>
        </div>
        <Link
          href="/riwayat?tab=reward"
          aria-label="Lihat reward"
          className="relative grid size-11 shrink-0 place-items-center rounded-full bg-surface text-ink-soft ring-1 ring-white/5 transition-colors active:bg-surface-2"
        >
          <Bell className="size-5" strokeWidth={1.9} />
          {stats.hasRewardReady ? (
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-accent ring-2 ring-surface" />
          ) : null}
        </Link>
      </header>

      {params.selamat || params.checkin === "sukses" ? (
        <div className="animate-rise flex items-start gap-2.5 rounded-2xl bg-accent-soft px-4 py-3 text-[12px] font-medium leading-relaxed text-accent">
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

      <section className="animate-rise relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-surface-3 via-surface-2 to-surface p-5 shadow-[var(--shadow-lift)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-accent/20 blur-3xl"
        />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Brand showText={false} />
            <div className="leading-none">
              <p className="text-[12px] font-bold text-ink">Kembabershop</p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">
                Member card
              </p>
            </div>
          </div>
          <Badge tone={stats.hasRewardReady ? "gold" : "muted"}>
            {stats.hasRewardReady
              ? `${stats.rewardsAvailable} reward`
              : "Aktif"}
          </Badge>
        </div>

        <div className="relative mt-6">
          <p className="text-[22px] font-bold leading-none tracking-[-0.01em] text-ink">
            {member.name}
          </p>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            {memberCode}
          </p>
        </div>

        <div className="relative mt-6 flex items-end justify-between gap-3">
          <p className="text-[13px] font-semibold text-ink">
            {stats.progress}
            <span className="text-muted">/{target} cukur</span>
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em]",
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
          className="relative mt-2.5"
        />
      </section>

      <section className="animate-rise flex items-center gap-3 rounded-[22px] border border-line bg-surface p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
          <MapPin className="size-5" strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-ink">
            Kembabershop Pusat
          </p>
          <p className="mt-0.5 text-[11px] text-muted">Buka {hours}</p>
        </div>
        <Badge tone={open ? "good" : "bad"}>{open ? "Buka" : "Tutup"}</Badge>
      </section>

      <section className="animate-rise">
        <h2 className="mb-3 px-1 text-[13px] font-bold text-ink">Akses cepat</h2>
        <div className="grid grid-cols-4 gap-2">
          <Shortcut
            href="/checkin"
            label="Scan"
            icon={<ScanLine className="size-6" strokeWidth={1.9} />}
            primary
          />
          <Shortcut
            href="/riwayat"
            label="Riwayat"
            icon={<History className="size-6" strokeWidth={1.9} />}
          />
          <Shortcut
            href="/riwayat?tab=reward"
            label="Reward"
            icon={<Gift className="size-6" strokeWidth={1.9} />}
          />
          <Shortcut
            href="/akun"
            label="Akun"
            icon={<UserRound className="size-6" strokeWidth={1.9} />}
          />
        </div>
      </section>

      <section className="animate-rise">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-[13px] font-bold text-ink">Progress reward</h2>
          <Link
            href="/riwayat?tab=reward"
            className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-accent active:opacity-60"
          >
            Lihat <ChevronRight className="size-3.5" />
          </Link>
        </div>
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
        <p className="mt-3 px-1 text-[11px] leading-relaxed text-muted">
          {stats.hasRewardReady
            ? `${stats.rewardsAvailable} cukur gratis siap dipakai.`
            : `${stats.remaining} cukur lagi untuk gratis.`}
        </p>
      </section>

      <div className="flex items-center justify-center gap-1.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted/60">
        <Clock className="size-3.5" /> {stats.totalVisits} kunjungan
      </div>
    </div>
  );
}

function Shortcut({
  href,
  label,
  icon,
  primary,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex select-none flex-col items-center gap-2 rounded-2xl py-1 touch-manipulation active:scale-[0.96]"
    >
      <span
        className={cn(
          "grid size-14 place-items-center rounded-full transition-colors",
          primary
            ? "bg-accent text-black shadow-[0_8px_20px_-10px_rgba(30,215,96,0.7)]"
            : "bg-surface-2 text-ink-soft ring-1 ring-white/5 group-active:bg-surface-3",
        )}
      >
        {icon}
      </span>
      <span className="text-[11px] font-medium leading-none text-ink-soft">
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
        "flex min-w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-[20px] border py-3.5",
        active && reward
          ? "border-amber-500 bg-gradient-to-br from-yellow-400 to-amber-600 text-black"
          : active
            ? "border-accent bg-accent text-black shadow-[0_6px_18px_-8px_rgba(30,215,96,0.7)]"
            : done
              ? "border-accent/20 bg-accent-soft text-accent"
              : "border-line bg-surface text-muted",
      )}
    >
      <span className="grid size-6 place-items-center">
        {done ? (
          <Check className="size-6" strokeWidth={3} />
        ) : reward ? (
          <Gift className="size-6" />
        ) : (
          <span className="text-lg font-bold">
            {String(number).padStart(2, "0")}
          </span>
        )}
      </span>
      <span
        className={cn(
          "mt-1 text-[10px] font-semibold",
          active ? "text-black/80" : done ? "text-accent" : "text-muted",
        )}
      >
        {label}
      </span>
    </div>
  );
}
