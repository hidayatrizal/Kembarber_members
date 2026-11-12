import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  Check,
  ChevronRight,
  Clock,
  Gift,
  History,
  MapPin,
  Plus,
  ScanLine,
  Star,
  UserRound,
} from "lucide-react";
import { Avatar, Badge } from "@/components/ui";
import { requireMember } from "@/lib/auth";
import { getMemberStats } from "@/lib/loyalty";
import { cn, initials, isShopOpen } from "@/lib/utils";

export const metadata: Metadata = { title: "Kartu Member" };

type SearchParams = {
  selamat?: string;
  checkin?: string;
  reward?: string;
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
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-tight text-ink">
              Hi, {firstName}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-muted">
              Selamat datang di Kembabershop
            </p>
          </div>
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
              ? `Kartu member berhasil dibuat. Selamat datang, ${firstName}!`
              : params.reward
                ? "Kunjungan berhasil dicatat. Kamu mendapat 1 cukur gratis."
                : `Kunjungan berhasil dicatat. Sisa ${stats.remaining} cukur menuju hadiah berikutnya.`}
          </p>
        </div>
      ) : null}

      <div className="animate-rise">
        <h1 className="text-[1.95rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink">
          Siap tampil
          <br />
          lebih rapi?
        </h1>
        <p className="mt-2 text-[12px] leading-relaxed text-muted">
          Kartu member, reward, dan kunjungan dalam satu tempat.
        </p>
      </div>

      <section className="animate-rise relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[var(--shadow-lift)]">
        <Image
          src="/barbershop.jpg"
          alt="Suasana barbershop Kembabershop"
          fill
          priority
          sizes="(max-width: 460px) 100vw, 460px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/90" />

        <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md">
          <Star className="size-3.5 fill-gold text-gold" />
          <span className="text-[11px] font-semibold text-white">
            {stats.paidVisits >= 10 ? "Gold member" : "Member aktif"}
          </span>
        </div>

        <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
          <div className="min-w-0">
            <p className="text-[17px] font-bold leading-tight text-white">
              {stats.progress}/{target} Potongan
            </p>
            <p className="mt-1 truncate text-[11px] text-gray-300">
              Kembabershop Pusat, Jakarta
            </p>
          </div>
          <Link
            href="/riwayat"
            aria-label="Lihat riwayat"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-black shadow-lg"
          >
            <ArrowUpRight className="size-5" />
          </Link>
        </div>
      </section>

      {stats.hasRewardReady ? (
        <Link
          href="/riwayat?tab=reward"
          className="animate-rise flex items-center justify-between gap-3 rounded-2xl border border-gold/20 bg-gold-soft px-4 py-3.5 transition-transform active:scale-[0.99]"
        >
          <div className="flex items-center gap-2.5">
            <Gift className="size-4 shrink-0 text-gold" />
            <p className="text-[12px] font-semibold text-gold">
              {stats.rewardsAvailable} cukur gratis siap ditukar
            </p>
          </div>
          <ChevronRight className="size-4 text-gold/70" />
        </Link>
      ) : null}

      <div className="animate-rise flex items-center justify-between rounded-2xl border border-white/5 bg-surface p-4">
        <div className="flex min-w-0 items-center gap-3">
          <MapPin className="size-5 shrink-0 text-accent" />
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-ink">
              Kembabershop Pusat
            </p>
            <p className="mt-0.5 truncate text-[10px] text-muted">
              Jakarta · 08.00–22.00 WIB
            </p>
          </div>
        </div>
        <Badge tone={open ? "good" : "bad"}>{open ? "Buka" : "Tutup"}</Badge>
      </div>

      <div className="animate-rise flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
        <Link
          href="/profil"
          aria-current="page"
          className="shrink-0 rounded-full bg-accent px-5 py-2 text-[12px] font-semibold text-black"
        >
          Ringkasan
        </Link>
        <Link
          href="/riwayat?tab=reward"
          className="shrink-0 rounded-full border border-white/5 bg-surface px-5 py-2 text-[12px] font-medium text-gray-300"
        >
          Reward
        </Link>
        <Link
          href="/riwayat"
          className="shrink-0 rounded-full border border-white/5 bg-surface px-5 py-2 text-[12px] font-medium text-gray-300"
        >
          Riwayat
        </Link>
      </div>

      <section className="animate-rise">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-[1.15rem] font-bold text-ink">Akses cepat</h2>
          <Link href="/akun" className="text-[11px] font-semibold text-accent">
            Lihat semua
          </Link>
        </div>
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
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-[1.15rem] font-bold text-ink">Progress reward</h2>
          <Link
            href="/riwayat?tab=reward"
            className="text-[11px] font-semibold text-accent"
          >
            Detail
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
      </section>

      <div className="flex items-center justify-center gap-1.5 pb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted/60">
        <Clock className="size-3.5" /> {stats.totalVisits} kunjungan tercatat
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
