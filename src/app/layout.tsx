import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Agentation } from "agentation";
import { AppSplash } from "@/components/app-splash";
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
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b2038",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

const themeInitScript = `(function(){try{var s=null;try{s=window.localStorage.getItem("kb-theme")}catch(e){}var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var h=document.documentElement;h.classList.toggle("dark",d);h.classList.toggle("light",!d);h.style.colorScheme=d?"dark":"light";h.dataset.theme=d?"dark":"light";try{var sa=window.navigator.standalone===true;if(!sa){sa=["standalone","minimal-ui","fullscreen"].some(function(m){return window.matchMedia("(display-mode: "+m+")").matches})}if(sa){h.dataset.standalone="true"}}catch(e){}var setMeta=function(){var m=document.querySelector('meta[name="theme-color"]');if(m){m.setAttribute("content",d?"#071320":"#0b2038")}};setMeta();window.addEventListener("DOMContentLoaded",setMeta)}catch(e){}})();`;

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
        <AppSplash />
        <ThemeProvider>{children}</ThemeProvider>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
