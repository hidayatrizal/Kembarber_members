"use client";

import { History, Home, ScanLine, UserRound } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";

const items = [
  { href: "/profil", label: "Beranda", icon: Home, exact: true },
  { href: "/checkin", label: "Check-in", icon: ScanLine },
  { href: "/riwayat", label: "Riwayat", icon: History },
  { href: "/akun", label: "Akun", icon: UserRound },
];

export function CustomerNav() {
  return <BottomNav items={items} ariaLabel="Navigasi utama" />;
}
