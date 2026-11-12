"use server";

import { revalidatePath } from "next/cache";
import { requireMember } from "@/lib/auth";
import { getMemberStats, recordPaidVisit } from "@/lib/loyalty";
import { verifyCheckinToken } from "@/lib/checkin-token";
import { CHECKIN_COOLDOWN_HOURS } from "@/lib/config";
import { formatDateTime, isShopOpen } from "@/lib/utils";

export type CheckinState = {
  ok?: boolean;
  error?: string;
  rewardReady?: boolean;
};

export async function checkinWithTokenAction(
  token: string,
): Promise<CheckinState> {
  const member = await requireMember();

  if (!verifyCheckinToken(token)) {
    return {
      error:
        "QR tidak valid. Scan QR resmi yang tertempel di barbershop untuk mencatat kunjungan.",
    };
  }

  if (!isShopOpen()) {
    return {
      error:
        "Check-in hanya bisa dilakukan saat jam operasional (08.00-22.00 WIB).",
    };
  }

  const result = await recordPaidVisit(member.id);

  if (!result.ok) {
    if (result.code === "cooldown") {
      return {
        error: `Kunjungan terakhir masih dalam masa jeda ${CHECKIN_COOLDOWN_HOURS / 24} hari. Check-in berikutnya bisa dilakukan mulai ${formatDateTime(
          result.nextAllowedAt,
        )}.`,
      };
    }
    return { error: "Check-in gagal. Coba lagi." };
  }

  const stats = await getMemberStats(member.id);

  revalidatePath("/profil");
  revalidatePath("/riwayat");
  revalidatePath("/checkin");

  return { ok: true, rewardReady: stats.hasRewardReady };
}
