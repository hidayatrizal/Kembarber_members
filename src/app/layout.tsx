import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
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
  interactiveWidget: "resizes-content",
};

const themeInitScript = `(function(){try{var s=null;try{s=window.localStorage.getItem("kb-theme")}catch(e){}var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var h=document.documentElement;h.classList.toggle("dark",d);h.classList.toggle("light",!d);h.style.colorScheme=d?"dark":"light";h.dataset.theme=d?"dark":"light";var setMeta=function(){var m=document.querySelector('meta[name="theme-color"]');if(m){m.setAttribute("content",d?"#070b09":"#f3f6f3")}};setMeta();window.addEventListener("DOMContentLoaded",setMeta)}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${jakarta.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
