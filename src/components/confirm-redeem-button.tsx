import { Ticket } from "lucide-react";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

export function ConfirmRedeemButton() {
  return (
    <ConfirmSubmitButton
      title="Tandai reward terpakai?"
      description="Gunakan hanya jika member lupa scan QR. Reward yang sudah ditandai tidak bisa dikembalikan."
      confirmLabel="Tandai"
      variant="primary"
      size="sm"
      icon={<Ticket className="size-3.5" />}
    >
      Tandai manual
    </ConfirmSubmitButton>
  );
}
