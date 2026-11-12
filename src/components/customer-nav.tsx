"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Home, ScanLine, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/profil", label: "Beranda", icon: Home },
  { href: "/checkin", label: "Check-in", icon: ScanLine },
  { href: "/riwayat", label: "Riwayat", icon: History },
  { href: "/akun", label: "Akun", icon: UserRound },
];

export function CustomerNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2 rounded-[2rem] bg-white p-2 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between">
        {items.map((item) => {
          const active =
            item.href === "/profil"
              ? pathname === "/profil"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center justify-center transition-colors",
                active
                  ? "gap-2 rounded-full bg-accent px-5 py-3 text-black"
                  : "p-3 text-gray-400 hover:text-black",
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
              {active ? (
                <span className="text-[13px] font-bold">{item.label}</span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
