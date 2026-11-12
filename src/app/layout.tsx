import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kembabershop — Membership & Loyalty",
    template: "%s · Kembabershop",
  },
  description:
    "Kartu member digital Kembabershop. Catat kunjungan cukur, pantau riwayat, dan kumpulkan hadiah cukur gratis.",
  applicationName: "Kembabershop",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Kembabershop",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#070b09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
