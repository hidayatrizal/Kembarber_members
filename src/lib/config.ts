export const SHOP_NAME = "Kembabershop";
export const SHOP_TAGLINE = "Gaya rapi, loyalitas berhadiah.";

export const LOYALTY_TARGET = 5;

// Default: scan QR bisa kapan saja tanpa jeda.
// Set CHECKIN_COOLDOWN_HOURS=72 dan CHECKIN_REQUIRE_SHOP_OPEN=true untuk
// mengaktifkan kembali pembatasan.
const cooldownEnv = Number(process.env.CHECKIN_COOLDOWN_HOURS ?? 0);
export const CHECKIN_COOLDOWN_HOURS =
  Number.isFinite(cooldownEnv) && cooldownEnv > 0 ? cooldownEnv : 0;
export const CHECKIN_REQUIRE_SHOP_OPEN =
  process.env.CHECKIN_REQUIRE_SHOP_OPEN === "true";

export const SHOP_TIMEZONE = "Asia/Jakarta";
export const SHOP_OPEN_HOUR = 8;
export const SHOP_CLOSE_HOUR = 22;

export const OWNER_COOKIE_PATH = "/owner";
