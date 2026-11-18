"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { buttonClass } from "@/components/ui";
import {
  removeHistoryImageAction,
  updateHistoryImageAction,
} from "@/lib/actions/shop";
import {
  initialShopSettingsState,
  type ShopSettingsState,
} from "@/lib/shop-settings-state";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const MAX_DIMENSION = 1600;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function prepareImage(file: File): Promise<File> {
  if (file.size <= 1_200_000) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));

    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob) return file;

    const name = file.name.replace(/\.[^.]+$/, "") || "foto";
    return new File([blob], `${name}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ShopHistoryForm({ imageUrl }: { imageUrl: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [pickError, setPickError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<ShopSettingsState | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [, updateAction, updating] = useActionState(
    async (prev: ShopSettingsState, _formData: FormData) => {
      if (!file) {
        const next: ShopSettingsState = {
          status: "error",
          message: "Pilih foto terlebih dahulu.",
        };
        setFeedback(next);
        return next;
      }

      const formData = new FormData();
      formData.append("historyImage", file);

      const next = await updateHistoryImageAction(prev, formData);
      if (next.status === "success") {
        setFile(null);
        setPreview(null);
        setPickError(null);
        if (inputRef.current) inputRef.current.value = "";
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
        setFile(null);
        setPreview(null);
        setPickError(null);
        if (inputRef.current) inputRef.current.value = "";
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

  const busy = updating || removing || preparing;

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const picked = input.files?.[0];
    if (!picked) return;

    setPickError(null);

    if (!ALLOWED_TYPES.includes(picked.type)) {
      setPickError("Gunakan foto JPG, PNG, atau WebP.");
      input.value = "";
      return;
    }

    setPreparing(true);
    try {
      const prepared = await prepareImage(picked);

      if (prepared.size > MAX_UPLOAD_BYTES) {
        setPickError("Ukuran foto masih di atas 4 MB. Pilih foto lain.");
        setFile(null);
        setPreview((current) => {
          if (current) URL.revokeObjectURL(current);
          return null;
        });
        input.value = "";
        return;
      }

      setFile(prepared);
      setPreview((current) => {
        if (current) URL.revokeObjectURL(current);
        return URL.createObjectURL(prepared);
      });
    } finally {
      setPreparing(false);
    }
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

      <form action={updateAction} className="space-y-2.5">
        <input
          ref={inputRef}
          id="historyImage"
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={onFileChange}
          className="sr-only"
        />
        <label
          htmlFor="historyImage"
          className={buttonClass(
            "secondary",
            "lg",
            `w-full cursor-pointer${busy ? " pointer-events-none opacity-60" : ""}`,
          )}
        >
          <ImagePlus className="size-4" aria-hidden />
          {preparing
            ? "Menyiapkan foto..."
            : file
              ? "Ganti pilihan foto"
              : "Pilih foto"}
        </label>

        <button
          type="submit"
          disabled={!file || busy}
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

      {pickError ? (
        <p role="alert" className="text-[12px] font-medium text-bad">
          {pickError}
        </p>
      ) : null}

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
        {file
          ? `Siap diunggah · ${formatSize(file.size)}`
          : "JPG, PNG, atau WebP. Maksimal 4 MB."}
      </p>
    </div>
  );
}
