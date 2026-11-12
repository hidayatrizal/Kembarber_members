import type { NextRequest } from "next/server";
import QRCode from "qrcode";
import { getCheckinToken } from "@/lib/checkin-token";

export async function GET(request: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const origin = configured || new URL(request.url).origin;
  const target = `${origin}/checkin?k=${getCheckinToken()}`;

  const png = await QRCode.toBuffer(target, {
    width: 720,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#0a0a0b", light: "#ffffff" },
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}
