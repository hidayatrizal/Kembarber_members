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

type CachedHistoryImage = {
  version: number;
  data: Uint8Array<ArrayBuffer>;
  mime: string;
};

let historyImageCache: CachedHistoryImage | null = null;

export async function getShopHistoryImage(version?: number) {
  if (!hasDatabase()) return null;

  if (
    historyImageCache &&
    (version === undefined || historyImageCache.version === version)
  ) {
    return historyImageCache;
  }

  const row = await getDb().shopSettings.findUnique({
    where: { id: SETTINGS_ID },
    select: { historyImage: true, historyImageMime: true, updatedAt: true },
  });

  if (!row?.historyImage || !row.historyImageMime) {
    historyImageCache = null;
    return null;
  }

  historyImageCache = {
    version: row.updatedAt.getTime(),
    data: new Uint8Array(row.historyImage),
    mime: row.historyImageMime,
  };

  return historyImageCache;
}

export async function saveShopHistoryImage(
  data: Uint8Array<ArrayBuffer>,
  mime: string,
) {
  const row = await getDb().shopSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, historyImage: data, historyImageMime: mime },
    update: { historyImage: data, historyImageMime: mime },
    select: { updatedAt: true },
  });
  historyImageCache = {
    version: row.updatedAt.getTime(),
    data,
    mime,
  };
}

export async function clearShopHistoryImage() {
  await getDb().shopSettings.updateMany({
    where: { id: SETTINGS_ID },
    data: { historyImage: null, historyImageMime: null },
  });
  historyImageCache = null;
}
