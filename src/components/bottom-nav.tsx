"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type BottomNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

export function BottomNav({
  items,
  ariaLabel,
  className,
}: {
  items: BottomNavItem[];
  ariaLabel: string;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-line bg-surface",
        className,
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div
        className="grid px-2 pb-2 pt-1.5"
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        }}
      >
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
              className="group flex min-h-[56px] select-none flex-col items-center justify-center gap-1 rounded-2xl px-1 touch-manipulation active:bg-overlay"
            >
              <span
                className={cn(
                  "grid h-8 w-16 place-items-center rounded-full transition-colors",
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-muted group-active:text-ink-soft",
                )}
              >
                <Icon className="size-[22px]" strokeWidth={active ? 2.4 : 1.9} />
              </span>
              <span
                className={cn(
                  "text-[11px] leading-none",
                  active ? "font-bold text-accent" : "font-medium text-muted",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
