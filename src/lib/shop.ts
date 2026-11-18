import "server-only";

import { getDb, hasDatabase } from "./db";

const SETTINGS_ID = "main";
export const DEFAULT_HISTORY_IMAGE = "/barbershop.jpg";

export type ShopHistorySettings = {
  historyImageUrl: string;
  hasCustomHistoryImage: boolean;
};

const FALLBACK: ShopHistorySettings = {
  historyImageUrl: DEFAULT_HISTORY_IMAGE,
  hasCustomHistoryImage: false,
};

export async function getShopHistorySettings(): Promise<ShopHistorySettings> {
  if (!hasDatabase()) return FALLBACK;

  try {
    const row = await getDb().shopSettings.findUnique({
      where: { id: SETTINGS_ID },
      select: { historyImageMime: true, updatedAt: true },
    });

    if (!row?.historyImageMime) return FALLBACK;

    return {
      historyImageUrl: `/api/shop/history-image?v=${row.updatedAt.getTime()}`,
      hasCustomHistoryImage: true,
    };
  } catch {
    return FALLBACK;
  }
}

export async function getShopHistoryImage() {
  if (!hasDatabase()) return null;

  const row = await getDb().shopSettings.findUnique({
    where: { id: SETTINGS_ID },
    select: { historyImage: true, historyImageMime: true },
  });

  if (!row?.historyImage || !row.historyImageMime) return null;

  return { data: row.historyImage, mime: row.historyImageMime };
}

export async function saveShopHistoryImage(
  data: Uint8Array<ArrayBuffer>,
  mime: string,
) {
  await getDb().shopSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, historyImage: data, historyImageMime: mime },
    update: { historyImage: data, historyImageMime: mime },
  });
}

export async function clearShopHistoryImage() {
  await getDb().shopSettings.updateMany({
    where: { id: SETTINGS_ID },
    data: { historyImage: null, historyImageMime: null },
  });
}
