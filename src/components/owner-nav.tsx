"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, QrCode, Users } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { cn } from "@/lib/utils";

const items = [
  { href: "/owner", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/owner/member", label: "Member", icon: Users },
  { href: "/owner/qr", label: "QR Check-in", icon: QrCode },
];

export function OwnerNav({ variant = "side" }: { variant?: "side" | "bottom" }) {
  const pathname = usePathname();

  if (variant === "bottom") {
    return (
      <BottomNav
        items={items}
        ariaLabel="Navigasi owner"
        className="max-w-lg lg:hidden"
      />
    );
  }

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors",
              active
                ? "bg-accent text-black"
                : "text-muted hover:bg-surface-2 hover:text-ink active:bg-surface-2",
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
