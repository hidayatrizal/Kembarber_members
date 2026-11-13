"use client";

import { Ticket } from "lucide-react";
import { buttonClass } from "@/components/ui";

export function ConfirmRedeemButton() {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (
          !window.confirm(
            "Tandai reward ini sudah dipakai secara manual? Gunakan hanya jika member lupa scan QR. Tindakan ini tidak bisa dibatalkan.",
          )
        ) {
          event.preventDefault();
        }
      }}
      className={buttonClass("primary", "sm")}
    >
      <Ticket className="size-3.5" /> Tandai manual
    </button>
  );
}
