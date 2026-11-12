import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kembabershop — Membership",
    short_name: "Kembaber",
    description:
      "Kartu member digital, riwayat cukur, dan hadiah loyalitas Kembabershop.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#070b09",
    theme_color: "#070b09",
    lang: "id",
    categories: ["lifestyle", "shopping"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
