import { LogOut } from "lucide-react";
import { ownerLogoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export function OwnerLogoutButton({ className }: { className?: string }) {
  return (
    <form action={ownerLogoutAction} className={className}>
      <button
        type="submit"
        className={cn(
          "inline-flex w-full items-center gap-2.5 rounded-full px-3.5 py-2.5 text-[12px] font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-ink",
        )}
      >
        <LogOut className="size-4" /> Keluar
      </button>
    </form>
  );
}
