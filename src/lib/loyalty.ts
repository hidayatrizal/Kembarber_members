import "server-only";

import { CHECKIN_COOLDOWN_HOURS, LOYALTY_TARGET } from "./config";
import { getDb } from "./db";

export type MemberStats = {
  paidVisits: number;
  freeVisits: number;
  totalVisits: number;
  rewardsEarned: number;
  rewardsAvailable: number;
  rewardsRedeemed: number;
  progress: number;
  remaining: number;
  target: number;
  hasRewardReady: boolean;
};

export async function getMemberStats(memberId: string): Promise<MemberStats> {
  const db = getDb();

  const [paidVisits, freeVisits, rewardsAvailable, rewardsRedeemed] =
    await Promise.all([
      db.visit.count({ where: { memberId, isFree: false } }),
      db.visit.count({ where: { memberId, isFree: true } }),
      db.reward.count({ where: { memberId, status: "available" } }),
      db.reward.count({ where: { memberId, status: "redeemed" } }),
    ]);

  const progress = paidVisits % LOYALTY_TARGET;

  return {
    paidVisits,
    freeVisits,
    totalVisits: paidVisits + freeVisits,
    rewardsEarned: rewardsAvailable + rewardsRedeemed,
    rewardsAvailable,
    rewardsRedeemed,
    progress,
    remaining: LOYALTY_TARGET - progress,
    target: LOYALTY_TARGET,
    hasRewardReady: rewardsAvailable > 0,
  };
}

/**
 * Materializes reward rows whenever a member accumulates enough paid visits.
 * Rewards are earned per LOYALTY_TARGET paid visits, and leftover progress
 * carries over into the next cycle.
 */
export async function syncRewards(memberId: string) {
  const db = getDb();

  const paidVisits = await db.visit.count({
    where: { memberId, isFree: false },
  });
  const earned = Math.floor(paidVisits / LOYALTY_TARGET);
  const existing = await db.reward.count({ where: { memberId } });

  if (earned > existing) {
    const rows: { memberId: string; status: string; cycle: number }[] = [];
    for (let i = existing; i < earned; i += 1) {
      rows.push({ memberId, status: "available", cycle: i + 1 });
    }
    await db.reward.createMany({ data: rows });
  }
}

export function getCooldownStatus(lastPaidAt: Date | string | null) {
  if (!lastPaidAt) {
    return { active: false, nextAllowedAt: null as Date | null };
  }
  const nextAllowedAt = new Date(
    new Date(lastPaidAt).getTime() + CHECKIN_COOLDOWN_HOURS * 60 * 60 * 1000,
  );
  return {
    active: Date.now() < nextAllowedAt.getTime(),
    nextAllowedAt,
  };
}

export type CheckinOutcome =
  | { ok: true }
  | { ok: false; code: "cooldown"; nextAllowedAt: Date }
  | { ok: false; code: "unavailable" };

export async function recordPaidVisit(
  memberId: string,
): Promise<CheckinOutcome> {
  const db = getDb();

  const last = await db.visit.findFirst({
    where: { memberId, isFree: false },
    orderBy: { visitedAt: "desc" },
    select: { visitedAt: true },
  });

  if (last) {
    const lastAt = new Date(last.visitedAt).getTime();
    const nextAllowed = lastAt + CHECKIN_COOLDOWN_HOURS * 60 * 60 * 1000;
    if (Date.now() < nextAllowed) {
      return {
        ok: false,
        code: "cooldown",
        nextAllowedAt: new Date(nextAllowed),
      };
    }
  }

  await db.visit.create({ data: { memberId, isFree: false } });
  await syncRewards(memberId);
  return { ok: true };
}

export async function getMemberVisits(memberId: string, limit = 100) {
  return getDb().visit.findMany({
    where: { memberId },
    orderBy: { visitedAt: "desc" },
    take: limit,
  });
}

export async function getMemberRewards(memberId: string) {
  return getDb().reward.findMany({
    where: { memberId },
    orderBy: { cycle: "desc" },
  });
}

export type RedeemOutcome =
  | { ok: true; rewardCycle: number }
  | { ok: false; code: "not_available" };

export async function redeemReward(
  rewardId: string,
  memberId: string,
  redeemedBy: string,
): Promise<RedeemOutcome> {
  const db = getDb();

  const updated = await db.reward.updateMany({
    where: { id: rewardId, memberId, status: "available" },
    data: {
      status: "redeemed",
      redeemedAt: new Date(),
      redeemedBy,
    },
  });

  if (updated.count === 0) {
    return { ok: false, code: "not_available" };
  }

  const reward = await db.reward.findUnique({
    where: { id: rewardId },
    select: { cycle: true },
  });

  const rewardVisit = await db.visit.create({
    data: {
      memberId,
      isFree: true,
      rewardId,
      note: "Cukur gratis (reward)",
    },
  });

  await db.reward.update({
    where: { id: rewardId },
    data: { rewardVisitId: rewardVisit.id },
  });

  return { ok: true, rewardCycle: reward?.cycle ?? 0 };
}

export type MemberSummary = {
  id: string;
  name: string;
  phone: string;
  createdAt: Date;
  stats: MemberStats;
  lastVisitAt: Date | null;
};

export async function listMembers(search?: string): Promise<MemberSummary[]> {
  const db = getDb();
  const term = search?.trim();

  const rows = await db.member.findMany({
    where: term
      ? {
          OR: [
            { name: { contains: term, mode: "insensitive" } },
            { phone: { contains: term } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      phone: true,
      createdAt: true,
      visits: { select: { isFree: true, visitedAt: true } },
      rewards: { select: { status: true } },
    },
  });

  return rows.map((row) => {
    const paidVisits = row.visits.filter((visit) => !visit.isFree).length;
    const freeVisits = row.visits.length - paidVisits;
    const rewardsAvailable = row.rewards.filter(
      (reward) => reward.status === "available",
    ).length;
    const rewardsRedeemed = row.rewards.filter(
      (reward) => reward.status === "redeemed",
    ).length;
    const progress = paidVisits % LOYALTY_TARGET;
    const lastVisitAt = row.visits.reduce<Date | null>(
      (latest, visit) =>
        !latest || visit.visitedAt > latest ? visit.visitedAt : latest,
      null,
    );

    const stats: MemberStats = {
      paidVisits,
      freeVisits,
      totalVisits: paidVisits + freeVisits,
      rewardsEarned: rewardsAvailable + rewardsRedeemed,
      rewardsAvailable,
      rewardsRedeemed,
      progress,
      remaining: LOYALTY_TARGET - progress,
      target: LOYALTY_TARGET,
      hasRewardReady: rewardsAvailable > 0,
    };

    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      createdAt: row.createdAt,
      stats,
      lastVisitAt,
    };
  });
}

export async function getPendingRewards(limit = 20) {
  const rows = await getDb().reward.findMany({
    where: { status: "available" },
    orderBy: { earnedAt: "asc" },
    take: limit,
    select: {
      id: true,
      cycle: true,
      earnedAt: true,
      member: { select: { id: true, name: true, phone: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    cycle: row.cycle,
    earnedAt: row.earnedAt,
    memberId: row.member.id,
    memberName: row.member.name,
    memberPhone: row.member.phone,
  }));
}
