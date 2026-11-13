"use client";

import { Moon, Smartphone, Sun, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/components/theme-provider";

const options: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Terang", icon: Sun },
  { value: "dark", label: "Gelap", icon: Moon },
  { value: "system", label: "Sistem", icon: Smartphone },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Pilih tema tampilan"
      className={cn(
        "grid grid-cols-3 gap-1 rounded-full border border-line bg-paper-deep p-1",
        className,
      )}
    >
      {options.map((option) => {
        const active = theme === option.value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-pressed={active}
            className={cn(
              "flex h-10 select-none items-center justify-center gap-1.5 rounded-full px-2 text-[11px] font-semibold transition-colors touch-manipulation",
              active
                ? "bg-accent text-on-accent shadow-[0_8px_20px_-14px_rgba(8,127,55,0.8)]"
                : "text-muted active:bg-overlay",
            )}
          >
            <Icon className="size-3.5" strokeWidth={2.1} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

const cycle: Theme[] = ["light", "dark", "system"];

export function ThemeQuickToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const next = cycle[(cycle.indexOf(theme) + 1) % cycle.length];
  const Icon =
    theme === "system" ? Smartphone : resolvedTheme === "dark" ? Moon : Sun;
  const label =
    theme === "system"
      ? "Tema mengikuti sistem"
      : theme === "dark"
        ? "Tema gelap"
        : "Tema terang";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`${label}. Ketuk untuk ganti tema.`}
      title={label}
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full text-ink-soft transition-colors touch-manipulation active:bg-overlay",
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={1.9} />
    </button>
  );
}