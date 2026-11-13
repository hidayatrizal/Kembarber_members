"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { buttonClass } from "@/components/ui";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type Size = "sm" | "md" | "lg";

export function ConfirmSubmitButton({
  title,
  description,
  confirmLabel,
  cancelLabel = "Batal",
  variant = "danger",
  size = "md",
  className,
  icon,
  children,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(() => confirmRef.current?.focus(), 80);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  const confirm = () => {
    const form = triggerRef.current?.closest("form");
    setOpen(false);
    form?.requestSubmit();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClass(variant, size, className)}
      >
        {icon}
        {children}
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70"
              onClick={() => setOpen(false)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                onClick={(event) => event.stopPropagation()}
                className="animate-sheet w-full max-w-md rounded-t-[28px] border-t border-white/10 bg-surface px-5 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] pt-3"
              >
                <div
                  aria-hidden
                  className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15"
                />
                <h2 id={titleId} className="text-[17px] font-bold text-ink">
                  {title}
                </h2>
                <p
                  id={descriptionId}
                  className="mt-2 text-[13px] leading-relaxed text-muted"
                >
                  {description}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className={buttonClass("secondary", "lg", "w-full")}
                  >
                    {cancelLabel}
                  </button>
                  <button
                    ref={confirmRef}
                    type="button"
                    onClick={confirm}
                    className={buttonClass(
                      variant === "danger" ? "danger" : "primary",
                      "lg",
                      "w-full",
                    )}
                  >
                    {confirmLabel}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
