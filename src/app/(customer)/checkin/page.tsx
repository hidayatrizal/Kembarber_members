import type { Metadata } from "next";
import { ScanLine, Ticket } from "lucide-react";
import { CheckinScanner } from "@/components/checkin-scanner";
import { Badge, ProgressBar } from "@/components/ui";
import {
  CHECKIN_COOLDOWN_HOURS,
  CHECKIN_REQUIRE_SHOP_OPEN,
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

export const metadata: Metadata = { title: "Check-in" };

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
  const cooldown = getCooldownStatus(lastPaid?.visitedAt ?? null);
  const cooldownActive = CHECKIN_COOLDOWN_HOURS > 0 && cooldown.active;
  const nextAllowed = cooldown.nextAllowedAt;
  const open = isShopOpen();
  const shopBlocked = CHECKIN_REQUIRE_SHOP_OPEN && !open;
  const canCheckin = !shopBlocked && !cooldownActive;
  const hours = `${String(SHOP_OPEN_HOUR).padStart(2, "0")}.00–${String(SHOP_CLOSE_HOUR).padStart(2, "0")}.00`;
  const disabledReason =
    cooldownActive && nextAllowed
      ? `Coba lagi ${formatDateTime(nextAllowed)}.`
      : `Buka ${hours}.`;

  return (
    <div className="space-y-5">
      <header className="animate-rise">
        <h1 className="font-display text-[clamp(2rem,9vw,2.6rem)] leading-[0.98] tracking-[-0.02em] text-ink">
          Check-in
        </h1>
      </header>

      <section className="animate-rise rounded-[28px] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <Badge tone={open ? "good" : "bad"}>
            {open ? "Buka" : "Tutup"}
          </Badge>
          <span className="text-[10px] font-semibold tracking-[0.12em] text-muted">
            {hours}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <span
            className={cn(
              "grid size-14 shrink-0 place-items-center rounded-[20px]",
              canCheckin
                ? "bg-accent text-black shadow-[0_0_24px_rgba(30,215,96,0.25)]"
                : "bg-paper-deep text-muted",
            )}
          >
            <ScanLine className="size-6" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[1.55rem] leading-none text-ink">
              {canCheckin
                ? "Siap scan"
                : cooldownActive
                  ? "Masih jeda"
                  : "Tutup"}
            </p>
            <p className="mt-1.5 text-[12px] text-muted">
              {canCheckin ? "Scan QR di barbershop." : disabledReason}
            </p>
          </div>
        </div>
      </section>

      <section className="animate-rise rounded-[26px] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="size-4 text-accent" />
            <p className="text-[13px] font-bold text-ink">Progress</p>
          </div>
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
        <p className="mt-3 text-[12px] text-muted">
          {stats.hasRewardReady
            ? `${stats.rewardsAvailable} reward siap.`
            : `${stats.remaining} cukur lagi.`}
        </p>
      </section>

      <div className="animate-rise">
        <CheckinScanner
          initialToken={initialToken}
          invalidToken={invalidToken}
          disabled={!canCheckin}
          rewardReady={stats.hasRewardReady}
          disabledReason={disabledReason}
        />
      </div>
    </div>
  );
}
