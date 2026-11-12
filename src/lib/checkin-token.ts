import { createHmac, timingSafeEqual } from "node:crypto";

const FALLBACK_SECRET = "kembabershop-dev-checkin-secret";

function getSecret() {
  const secret = process.env.CHECKIN_QR_SECRET || process.env.SESSION_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CHECKIN_QR_SECRET atau SESSION_SECRET wajib diatur di produksi.",
      );
    }
    return FALLBACK_SECRET;
  }

  return secret;
}

export function getCheckinToken(): string {
  return createHmac("sha256", getSecret())
    .update("kembabershop-checkin-qr-v1")
    .digest("base64url")
    .slice(0, 24);
}

export function verifyCheckinToken(
  token: string | null | undefined,
): boolean {
  if (!token) return false;

  const expected = getCheckinToken();
  const actualBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}
