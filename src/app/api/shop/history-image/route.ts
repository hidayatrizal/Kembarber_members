import { getShopHistoryImage } from "@/lib/shop";

export async function GET(request: Request) {
  const rawVersion = new URL(request.url).searchParams.get("v");
  const parsedVersion = rawVersion ? Number(rawVersion) : undefined;
  const version =
    parsedVersion !== undefined && Number.isFinite(parsedVersion)
      ? parsedVersion
      : undefined;

  try {
    const image = await getShopHistoryImage(version);

    if (!image) {
      return new Response("Foto belum diunggah.", {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return new Response(new Uint8Array(image.data), {
      headers: {
        "Content-Type": image.mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Foto tidak tersedia.", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
