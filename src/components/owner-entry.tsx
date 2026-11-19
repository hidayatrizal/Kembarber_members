"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronRight, MoreVertical, Store, X } from "lucide-react";

export function OwnerEntry() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !sheetRef.current) return;

      const focusables = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ),
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(() => linkRef.current?.focus(), 80);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
      if (trigger?.isConnected) trigger.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menu lainnya"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="md-state grid size-12 shrink-0 place-items-center rounded-full text-ink-soft transition-colors touch-manipulation"
      >
        <MoreVertical className="size-5" strokeWidth={2} />
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className="animate-fade fixed inset-0 z-[120] flex items-end justify-center bg-black/40"
              onClick={() => setOpen(false)}
            >
              <div
                ref={sheetRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                onClick={(event) => event.stopPropagation()}
                className="animate-sheet w-full max-w-md rounded-t-[28px] bg-surface px-5 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.18)] md:mb-8 md:rounded-[28px]"
              >
                <div
                  aria-hidden
                  className="mx-auto mb-4 h-1 w-10 rounded-full bg-line-strong"
                />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2
                      id={titleId}
                      className="text-[18px] font-medium leading-6 text-ink"
                    >
                      Menu
                    </h2>
                    <p
                      id={descriptionId}
                      className="mt-1 text-[12px] leading-relaxed text-muted"
                    >
                      Khusus pemilik barbershop.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Tutup menu"
                    className="md-state grid size-12 shrink-0 place-items-center rounded-full text-muted transition-colors touch-manipulation"
                  >
                    <X className="size-4" strokeWidth={2} />
                  </button>
                </div>

                <Link
                  ref={linkRef}
                  href="/owner/masuk"
                  onClick={() => setOpen(false)}
                  className="md-state mt-4 flex min-h-[68px] items-center gap-3 rounded-[18px] bg-surface-2 px-4 py-3 transition-colors touch-manipulation"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-ink">
                    <Store className="size-5" strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-medium text-ink">
                      Masuk sebagai owner
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-relaxed text-muted">
                      Kelola member, QR, dan kunjungan.
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted/70" />
                </Link>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="md-state mt-3 h-12 w-full rounded-full text-[13px] font-medium text-accent-ink transition-colors touch-manipulation"
                >
                  Tutup
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}