import { Trash2 } from "lucide-react";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

export function DeleteMemberButton({ memberName }: { memberName: string }) {
  return (
    <ConfirmSubmitButton
      title="Hapus akun member?"
      description={`Akun ${memberName} beserta seluruh riwayat kunjungan dan reward akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
      confirmLabel="Hapus"
      variant="danger"
      size="md"
      className="w-full"
      icon={<Trash2 className="size-4" />}
    >
      Hapus akun member
    </ConfirmSubmitButton>
  );
}
