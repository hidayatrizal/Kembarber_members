"use server";

import { revalidatePath } from "next/cache";
import { requireMember } from "@/lib/auth";
import { recordCheckin } from "@/lib/loyalty";
import { verifyCheckinToken } from "@/lib/checkin-token";
import {
  CHECKIN_COOLDOWN_HOURS,
  CHECKIN_REQUIRE_SHOP_OPEN,
} from "@/lib/config";
import { formatDateTime, isShopOpen } from "@/lib/utils";

export type CheckinState = {
  ok?: boolean;
  error?: string;
  freeVisit?: boolean;
  rewardEarned?: boolean;
  rewardCycle?: number;
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

  if (CHECKIN_REQUIRE_SHOP_OPEN && !isShopOpen()) {
    return {
      error:
        "Check-in hanya bisa dilakukan saat jam operasional (08.00-22.00 WIB).",
    };
  }

  const result = await recordCheckin(member.id);

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

  revalidatePath("/profil");
  revalidatePath("/riwayat");
  revalidatePath("/checkin");
  revalidatePath("/owner");
  revalidatePath("/owner/member");

  if (result.free) {
    return {
      ok: true,
      freeVisit: true,
      rewardCycle: result.rewardCycle,
    };
  }

  return {
    ok: true,
    freeVisit: false,
    rewardEarned: result.rewardEarned,
  };
}
