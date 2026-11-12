import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronRight,
  Clock,
  Gift,
  History,
  WalletCards,
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { Avatar, Badge } from "@/components/ui";
import { requireMember } from "@/lib/auth";
import {
  CHECKIN_COOLDOWN_HOURS,
  LOYALTY_TARGET,
  SHOP_CLOSE_HOUR,
  SHOP_OPEN_HOUR,
} from "@/lib/config";
import { formatDate, formatPhone, initials } from "@/lib/utils";

export const metadata: Metadata = { title: "Akun" };

export default async function AccountPage() {
  const member = await requireMember("/akun");
  const memberCode = `KB-${member.id.slice(0, 6).toUpperCase()}`;

  return (
    <div className="space-y-6">
      <header className="animate-rise">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
          Akun
        </p>
        <h1 className="mt-1 font-display text-[clamp(2rem,9vw,2.6rem)] leading-[0.98] tracking-[-0.02em] text-ink">
          Pengaturan member.
        </h1>
        <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
          Informasi kartu, aturan loyalitas, dan akses akun kamu.
        </p>
      </header>

      <section className="animate-rise flex items-center gap-4 rounded-[28px] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
        <Avatar initials={initials(member.name)} className="size-14 text-[15px]" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-[1.45rem] font-bold leading-tight tracking-[-0.01em] text-ink">
            {member.name}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <p className="text-[12px] text-muted">{formatPhone(member.phone)}</p>
            <Badge tone="good" className="shrink-0">
              <BadgeCheck className="size-3" /> Aktif
            </Badge>
          </div>
        </div>
      </section>

      <section className="animate-rise divide-y divide-line overflow-hidden rounded-[26px] border border-line bg-surface shadow-[var(--shadow-card)]">
        <DetailRow label="Nomor HP" value={formatPhone(member.phone)} />
        <DetailRow label="Member sejak" value={formatDate(member.createdAt)} />
        <DetailRow label="ID member" value={memberCode} mono />
      </section>

      <section className="animate-rise overflow-hidden rounded-[1.75rem] border border-accent/20 bg-surface p-5 shadow-[var(--shadow-card)]">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-accent">
          Aturan loyalitas
        </p>
        <p className="mt-2 text-[1.9rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
          {LOYALTY_TARGET} cukur berbayar,
          <br />
          <span className="text-accent">1 cukur gratis.</span>
        </p>
        <p className="mt-2.5 text-[11px] leading-relaxed text-muted">
          Reward dibuat otomatis setelah mencapai target dan ditukar di kasir.
          Kunjungan gratis tidak menambah poin baru.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
              Jeda check-in
            </p>
            <p className="mt-1 text-[13px] font-semibold text-ink">
              {CHECKIN_COOLDOWN_HOURS} jam
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
              Jam operasional
            </p>
            <p className="mt-1 text-[13px] font-semibold text-ink">
              {String(SHOP_OPEN_HOUR).padStart(2, "0")}.00–
              {String(SHOP_CLOSE_HOUR).padStart(2, "0")}.00
            </p>
          </div>
        </div>
      </section>

      <section className="animate-rise divide-y divide-line overflow-hidden rounded-[26px] border border-line bg-surface shadow-[var(--shadow-card)]">
        <MenuRow
          href="/profil"
          icon={<WalletCards className="size-4" />}
          title="Kartu member"
          description="Lihat kartu digital dan progress"
        />
        <MenuRow
          href="/riwayat"
          icon={<History className="size-4" />}
          title="Riwayat & reward"
          description="Semua kunjungan dan hadiah"
        />
        <MenuRow
          href="/checkin"
          icon={<Gift className="size-4" />}
          title="Check-in cukur"
          description="Catat kunjungan setelah pembayaran"
        />
      </section>

      <div className="animate-rise">
        <LogoutButton />
      </div>

      <div className="flex items-center justify-center gap-1.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted/70">
        <Clock className="size-3.5" /> Kembabershop member club
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <p className="text-[11px] text-muted">{label}</p>
      <p
        className={
          mono
            ? "font-mono text-[11px] font-semibold tracking-[0.12em] text-ink"
            : "text-[12px] font-semibold text-ink"
        }
      >
        {value}
      </p>
    </div>
  );
}

function MenuRow({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper-deep text-ink-soft">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-[11px] text-muted">{description}</p>
      </div>
      <ChevronRight className="size-4 text-muted/60" />
    </Link>
  );
}
