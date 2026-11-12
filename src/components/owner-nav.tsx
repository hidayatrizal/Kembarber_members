"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, QrCode, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/owner", label: "Dashboard", icon: LayoutDashboard },
  { href: "/owner/member", label: "Member", icon: Users },
  { href: "/owner/qr", label: "QR Check-in", icon: QrCode },
];

export function OwnerNav({ variant = "side" }: { variant?: "side" | "bottom" }) {
  const pathname = usePathname();

  if (variant === "bottom") {
    return (
      <nav className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2 rounded-[2rem] bg-white p-2 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.9)] lg:hidden">
        <div className="flex items-center justify-between">
          {items.map((item) => {
            const active =
              item.href === "/owner"
                ? pathname === "/owner"
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
                    ? "gap-2 rounded-full bg-accent px-4 py-3 text-black"
                    : "p-3 text-gray-400 hover:text-black",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                {active ? (
                  <span className="text-[12px] font-bold">{item.label}</span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active =
          item.href === "/owner"
            ? pathname === "/owner"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors",
              active
                ? "bg-accent text-black"
                : "text-muted hover:bg-surface-2 hover:text-ink",
            )}
          >
            <Icon className="size-[18px]" strokeWidth={active ? 2.3 : 2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
