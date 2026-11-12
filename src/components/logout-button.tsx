import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export function LogoutButton({
  className,
  label = "Keluar dari akun",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <form action={logoutAction} className={className}>
      <button
        type="submit"
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-full border border-bad/20 bg-bad-soft px-5 py-3.5 text-[13px] font-semibold text-bad transition-colors hover:bg-bad/10 active:scale-[0.985]",
        )}
      >
        <LogOut className="size-4" />
        {label}
      </button>
    </form>
  );
}
