"use client";

import { Printer } from "lucide-react";
import { buttonClass } from "@/components/ui";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={buttonClass("secondary", "md")}
    >
      <Printer className="size-4" /> Cetak QR
    </button>
  );
}
