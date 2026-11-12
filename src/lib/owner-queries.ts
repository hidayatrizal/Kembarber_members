import "server-only";

import { getDb } from "./db";
import {
  getMemberRewards,
  getMemberStats,
  getMemberVisits,
  listMembers,
} from "./loyalty";

const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000;

function startOfJakartaDay(now = new Date()) {
  const shifted = new Date(now.getTime() + JAKARTA_OFFSET_MS);
  return new Date(
    Date.UTC(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth(),
      shifted.getUTCDate(),
    ) - JAKARTA_OFFSET_MS,
  );
}

function startOfJakartaMonth(now = new Date()) {
  const shifted = new Date(now.getTime() + JAKARTA_OFFSET_MS);
  return new Date(
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), 1) -
      JAKARTA_OFFSET_MS,
  );
}

export async function getOwnerOverview() {
  const db = getDb();
  const now = new Date();
  const dayStart = startOfJakartaDay(now);
  const monthStart = startOfJakartaMonth(now);

  const [
    totalMembers,
    paidVisits,
    freeVisits,
    availableRewards,
    redeemedRewards,
    todayVisits,
    monthVisits,
    newMembersThisMonth,
    recentRows,
    allMembers,
  ] = await Promise.all([
    db.member.count(),
    db.visit.count({ where: { isFree: false } }),
    db.visit.count({ where: { isFree: true } }),
    db.reward.count({ where: { status: "available" } }),
    db.reward.count({ where: { status: "redeemed" } }),
    db.visit.count({ where: { visitedAt: { gte: dayStart } } }),
    db.visit.count({ where: { visitedAt: { gte: monthStart } } }),
    db.member.count({ where: { createdAt: { gte: monthStart } } }),
    db.visit.findMany({
      orderBy: { visitedAt: "desc" },
      take: 6,
      select: {
        id: true,
        isFree: true,
        visitedAt: true,
        member: { select: { id: true, name: true } },
      },
    }),
    listMembers(),
  ]);

  const recentVisits = recentRows.map((visit) => ({
    id: visit.id,
    isFree: visit.isFree,
    visitedAt: visit.visitedAt,
    memberId: visit.member.id,
    memberName: visit.member.name,
  }));

  const nearReward = allMembers
    .filter(
      (member) =>
        member.stats.progress >= 3 &&
        member.stats.progress < member.stats.target &&
        !member.stats.hasRewardReady,
    )
    .sort((a, b) => b.stats.progress - a.stats.progress)
    .slice(0, 5);

  const topLoyal = allMembers
    .sort((a, b) => b.stats.paidVisits - a.stats.paidVisits)
    .slice(0, 5);

  return {
    totalMembers,
    paidVisits,
    freeVisits,
    availableRewards,
    redeemedRewards,
    todayVisits,
    monthVisits,
    newMembersThisMonth,
    recentVisits,
    nearReward,
    topLoyal,
  };
}

export async function getMemberDetail(memberId: string) {
  const db = getDb();

  const member = await db.member.findUnique({
    where: { id: memberId },
    select: { id: true, name: true, phone: true, createdAt: true },
  });

  if (!member) return null;

  const [stats, visitRows, rewardRows] = await Promise.all([
    getMemberStats(memberId),
    getMemberVisits(memberId),
    getMemberRewards(memberId),
  ]);

  return { member, stats, visits: visitRows, rewards: rewardRows };
}
