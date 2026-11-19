"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Phase = "loading" | "leaving" | "done";

export function AppSplash() {
  const [progress, setProgress] = useState(1);
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    const navigatorWithStandalone = window.navigator as Navigator & {
      standalone?: boolean;
    };
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      navigatorWithStandalone.standalone === true;

    if (!standalone) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timers: number[] = [];
    let raf = 0;

    const finish = () => {
      timers.push(window.setTimeout(() => setPhase("leaving"), 260));
      timers.push(window.setTimeout(() => setPhase("done"), 620));
    };

    if (reduced) {
      timers.push(window.setTimeout(() => setProgress(100), 120));
      timers.push(window.setTimeout(finish, 600));

      return () => {
        timers.forEach((id) => window.clearTimeout(id));
      };
    }

    const duration = 1500;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.max(1, Math.round(eased * 100)));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={cn(
        "app-splash fixed inset-0 z-[100] flex-col items-center justify-center bg-[#0f2d50] px-8 text-white transition-opacity duration-300",
        phase === "leaving" && "pointer-events-none opacity-0",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(23,58,94,0.9),transparent_60%)]"
      />
      <div className="relative flex flex-col items-center">
        <div className="relative grid size-28 place-items-center">
          <span
            aria-hidden
            className="app-splash-ring absolute inset-0 rounded-full border-2 border-white/25 border-t-black"
          />
          <span className="grid size-[84px] place-items-center rounded-[24px] bg-white/10 ring-1 ring-white/10">
            <Image
              src="/logoapl.png"
              alt="Kembabershop"
              width={467}
              height={400}
              priority
              className="h-11 w-auto brightness-0 invert"
            />
          </span>
        </div>

        <p className="mt-6 text-[18px] font-bold tracking-[-0.02em]">
          Kembabershop
        </p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-fog">
          Menyiapkan aplikasi
        </p>

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Memuat aplikasi"
          className="mt-7 w-56"
        >
          <div className="h-1.5 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-black"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-center font-mono text-[11px] font-medium tabular-nums text-fog">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
