"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { redeemReward } from "@/lib/loyalty";

export async function redeemRewardAction(formData: FormData) {
  const owner = await requireOwner();

  const rewardId = String(formData.get("rewardId") ?? "");
  const memberId = String(formData.get("memberId") ?? "");

  if (!rewardId || !memberId) {
    redirect("/owner/member");
  }

  const result = await redeemReward(rewardId, memberId, owner.name || "Owner");

  revalidatePath("/owner");
  revalidatePath(`/owner/member/${memberId}`);
  revalidatePath("/owner/member");

  if (!result.ok) {
    redirect(`/owner/member/${memberId}?redeem=gagal`);
  }

  redirect(`/owner/member/${memberId}?redeem=sukses`);
}

export async function deleteMemberAction(formData: FormData) {
  await requireOwner();

  const memberId = String(formData.get("memberId") ?? "");
  if (!memberId) {
    redirect("/owner/member?hapus=gagal");
  }

  const db = getDb();
  const deleted = await db.$transaction(async (tx) => {
    const member = await tx.member.findUnique({
      where: { id: memberId },
      select: { id: true },
    });

    if (!member) return false;

    await tx.visit.deleteMany({ where: { memberId } });
    await tx.reward.deleteMany({ where: { memberId } });
    await tx.member.delete({ where: { id: memberId } });

    return true;
  });

  revalidatePath("/owner");
  revalidatePath("/owner/member");
  revalidatePath("/riwayat");
  revalidatePath("/profil");

  redirect(deleted ? "/owner/member?hapus=sukses" : "/owner/member?hapus=gagal");
}
