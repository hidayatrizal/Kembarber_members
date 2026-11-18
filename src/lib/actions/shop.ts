"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import { clearShopHistoryImage, saveShopHistoryImage } from "@/lib/shop";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export type ShopSettingsState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const initialShopSettingsState: ShopSettingsState = { status: "idle" };

export async function updateHistoryImageAction(
  _prev: ShopSettingsState,
  formData: FormData,
): Promise<ShopSettingsState> {
  await requireOwner();

  const file = formData.get("historyImage");

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Pilih foto terlebih dahulu." };
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return { status: "error", message: "Gunakan foto JPG, PNG, atau WebP." };
  }

  if (file.size > MAX_BYTES) {
    return { status: "error", message: "Ukuran foto maksimal 4 MB." };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  await saveShopHistoryImage(bytes, file.type);

  revalidatePath("/");
  revalidatePath("/owner/pengaturan");

  return { status: "success", message: "Foto sejarah berhasil diperbarui." };
}

export async function removeHistoryImageAction(
  _prev: ShopSettingsState,
  _formData: FormData,
): Promise<ShopSettingsState> {
  await requireOwner();

  await clearShopHistoryImage();

  revalidatePath("/");
  revalidatePath("/owner/pengaturan");

  return { status: "success", message: "Foto dikembalikan ke default." };
}
