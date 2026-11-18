export type ShopSettingsState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const initialShopSettingsState: ShopSettingsState = { status: "idle" };
