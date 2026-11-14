import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({
  href = "/",
  className,
  showText = true,
}: {
  href?: string;
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <span className="grid size-9 place-items-center rounded-[12px] bg-accent text-[17px] font-extrabold leading-none text-on-accent shadow-[0_0_18px_rgba(30,215,96,0.28)]">
        K
      </span>
      {showText ? (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-extrabold tracking-[-0.03em] text-ink">
            kembabershop
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase leading-none tracking-[0.18em] text-muted">
            Member club
          </span>
        </span>
      ) : null}
    </Link>
  );
}
