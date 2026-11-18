import { getShopHistoryImage } from "@/lib/shop";

export async function GET() {
  try {
    const image = await getShopHistoryImage();

    if (!image) {
      return new Response("Foto belum diunggah.", { status: 404 });
    }

    return new Response(new Uint8Array(image.data), {
      headers: {
        "Content-Type": image.mime,
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return new Response("Foto tidak tersedia.", { status: 404 });
  }
}
