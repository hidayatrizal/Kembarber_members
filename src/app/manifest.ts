import type { MetadataRoute } from "next";

const icon = {
  src: "/icon-192.png",
  sizes: "192x192",
  type: "image/png",
} as const;

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Kembabershop — Membership",
    short_name: "Kembaber",
    description:
      "Kartu member digital, riwayat cukur, dan hadiah loyalitas Kembabershop.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait",
    background_color: "#070b09",
    theme_color: "#070b09",
    lang: "id",
    categories: ["lifestyle", "shopping"],
    prefer_related_applications: false,
    launch_handler: { client_mode: "navigate-existing" },
    shortcuts: [
      {
        name: "Scan check-in",
        short_name: "Scan",
        description: "Scan QR di barbershop untuk mencatat kunjungan.",
        url: "/checkin",
        icons: [icon],
      },
      {
        name: "Riwayat cukur",
        short_name: "Riwayat",
        description: "Lihat riwayat kunjungan dan reward.",
        url: "/riwayat",
        icons: [icon],
      },
    ],
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
