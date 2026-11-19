import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({
  href = "/",
  className,
  showText = true,
  onPrimary = false,
}: {
  href?: string;
  className?: string;
  showText?: boolean;
  onPrimary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5",
        onPrimary ? "text-white" : "text-ink",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-9 place-items-center rounded-[12px] text-[17px] font-extrabold leading-none",
          onPrimary
            ? "bg-glass text-white"
            : "bg-primary text-on-primary",
        )}
      >
        K
      </span>
      {showText ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "text-[15px] font-extrabold tracking-[-0.03em]",
              onPrimary ? "text-white" : "text-primary",
            )}
          >
            kembabershop
          </span>
          <span
            className={cn(
              "mt-1 text-[10px] font-bold uppercase leading-none tracking-[0.18em]",
              onPrimary ? "text-fog" : "text-muted",
            )}
          >
            Member club
          </span>
        </span>
      ) : null}
    </Link>
  );
}
