"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { buttonClass } from "@/components/ui";
import {
  initialShopSettingsState,
  removeHistoryImageAction,
  updateHistoryImageAction,
  type ShopSettingsState,
} from "@/lib/actions/shop";

export function ShopHistoryForm({ imageUrl }: { imageUrl: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<ShopSettingsState | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [, updateAction, updating] = useActionState(
    async (prev: ShopSettingsState, formData: FormData) => {
      const next = await updateHistoryImageAction(prev, formData);
      if (next.status === "success") {
        formRef.current?.reset();
        setPreview(null);
      }
      setFeedback(next);
      return next;
    },
    initialShopSettingsState,
  );

  const [, removeAction, removing] = useActionState(
    async (prev: ShopSettingsState, formData: FormData) => {
      const next = await removeHistoryImageAction(prev, formData);
      if (next.status === "success") {
        formRef.current?.reset();
        setPreview(null);
      }
      setFeedback(next);
      return next;
    },
    initialShopSettingsState,
  );

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const busy = updating || removing;

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-surface-2">
        <Image
          src={preview ?? imageUrl}
          alt="Pratinjau foto sejarah"
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-cover"
        />
      </div>

      <form ref={formRef} action={updateAction} className="space-y-2.5">
        <input
          id="historyImage"
          name="historyImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onFileChange}
          className="sr-only"
        />
        <label
          htmlFor="historyImage"
          className={buttonClass("secondary", "lg", "w-full cursor-pointer")}
        >
          <ImagePlus className="size-4" aria-hidden />
          {preview ? "Ganti pilihan foto" : "Pilih foto"}
        </label>

        <button
          type="submit"
          disabled={!preview || busy}
          className={buttonClass("primary", "lg", "w-full")}
        >
          {updating ? "Menyimpan..." : "Simpan foto"}
        </button>
      </form>

      <form action={removeAction}>
        <ConfirmSubmitButton
          title="Hapus foto sejarah?"
          description="Foto akan dikembalikan ke gambar default. Kamu bisa mengunggah lagi kapan saja."
          confirmLabel="Hapus"
          variant="danger"
          size="md"
          className="w-full"
          icon={<Trash2 className="size-4" aria-hidden />}
        >
          {removing ? "Menghapus..." : "Hapus foto"}
        </ConfirmSubmitButton>
      </form>

      {feedback?.message ? (
        <p
          role={feedback.status === "error" ? "alert" : "status"}
          className={
            feedback.status === "error"
              ? "text-[12px] font-medium text-bad"
              : "text-[12px] font-medium text-accent-ink"
          }
        >
          {feedback.message}
        </p>
      ) : null}

      <p className="text-[11px] leading-relaxed text-muted">
        JPG, PNG, atau WebP. Maksimal 4 MB.
      </p>
    </div>
  );
}
