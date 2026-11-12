"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
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
