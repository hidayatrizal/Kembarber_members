"use client";

import { Trash2 } from "lucide-react";
import { buttonClass } from "@/components/ui";

export function DeleteMemberButton({ memberName }: { memberName: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        const confirmed = window.confirm(
          `Hapus akun ${memberName}? Semua riwayat kunjungan dan reward akan terhapus permanen dan tidak bisa dikembalikan.`,
        );
        if (!confirmed) event.preventDefault();
      }}
      className={buttonClass("danger", "md", "w-full")}
    >
      <Trash2 className="size-4" /> Hapus akun member
    </button>
  );
}
