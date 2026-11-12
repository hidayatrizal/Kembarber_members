"use client";

import { useCallback, useEffect, useRef, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ScanLine, X } from "lucide-react";
import { checkinWithTokenAction } from "@/lib/actions/checkin";
import { buttonClass } from "@/components/ui";

type Phase = "idle" | "scanning" | "recording" | "error";

export function CheckinScanner({
  initialToken,
  invalidToken,
  disabled,
  disabledReason,
}: {
  initialToken?: string;
  invalidToken?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>(
    initialToken ? "recording" : "idle",
  );
  const [error, setError] = useState<string | null>(
    invalidToken
      ? "QR tidak valid. Pastikan kamu scan QR resmi yang tertempel di barbershop."
      : null,
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const initialSubmitted = useRef(false);

  const stopCamera = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
  }, []);

  const submitToken = useCallback(
    (token: string) => {
      setError(null);
      setPhase("recording");

      startTransition(async () => {
        const result = await checkinWithTokenAction(token);

        if (result.error) {
          setError(result.error);
          setPhase("error");
          return;
        }

        const params = new URLSearchParams({ checkin: "sukses" });
        if (result.rewardReady) params.set("reward", "1");
        router.push(`/profil?${params.toString()}`);
        router.refresh();
      });
    },
    [router],
  );

  useEffect(() => {
    if (!initialToken || initialSubmitted.current) return;
    initialSubmitted.current = true;
    submitToken(initialToken);
  }, [initialToken, submitToken]);

  useEffect(() => {
    if (phase !== "scanning") return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    (async () => {
      try {
        const { BrowserQRCodeReader } = await import("@zxing/browser");
        if (cancelled) return;

        const reader = new BrowserQRCodeReader();
        const controls = await reader.decodeFromConstraints(
          { video: { facingMode: { ideal: "environment" } } },
          video,
          (result) => {
            if (!result) return;

            const token = extractToken(result.getText());
            stopCamera();

            if (!token) {
              setError(
                "QR tidak dikenali. Pastikan kamu scan QR resmi Kembabershop.",
              );
              setPhase("error");
              return;
            }

            submitToken(token);
          },
        );

        if (cancelled) {
          controls.stop();
          return;
        }
        controlsRef.current = controls;
      } catch (err) {
        if (cancelled) return;
        setError(cameraErrorMessage(err));
        setPhase("error");
      }
    })();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [phase, stopCamera, submitToken]);

  const disabledMessage = disabled
    ? (disabledReason ?? "Check-in belum tersedia saat ini.")
    : phase === "recording"
      ? "Memverifikasi QR dan mencatat kunjungan..."
      : "Kamera akan terbuka. Arahkan ke QR resmi yang tertempel di barbershop.";

  return (
    <div className="space-y-3">
      {error ? (
        <div className="rounded-2xl border border-bad/20 bg-bad-soft px-4 py-3 text-[12px] font-medium leading-relaxed text-bad">
          {error}
        </div>
      ) : null}

      {phase === "recording" ? (
        <div className="flex items-center justify-center gap-2 rounded-full bg-accent-soft px-5 py-4 text-[13px] font-bold text-accent">
          <Loader2 className="size-4 animate-spin" />
          Mencatat kunjungan...
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setError(null);
            setPhase("scanning");
          }}
          disabled={disabled}
          className={buttonClass("primary", "lg", "w-full")}
        >
          <ScanLine className="size-4" />
          {disabled
            ? "Check-in belum tersedia"
            : error
              ? "Scan ulang QR"
              : "Scan QR & catat kunjungan"}
        </button>
      )}

      <p className="text-center text-[11px] leading-relaxed text-muted">
        {disabledMessage}
      </p>

      {phase === "scanning" ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 px-5 pb-8 pt-8 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-sm items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                Scan QR
              </p>
              <p className="mt-1 text-[15px] font-bold text-white">
                Arahkan ke QR barbershop
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPhase("idle")}
              aria-label="Tutup kamera"
              className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/10 text-white"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="relative mx-auto mt-8 w-full max-w-sm overflow-hidden rounded-[30px] border border-white/10 bg-black">
            <video
              ref={videoRef}
              className="aspect-square w-full object-cover"
              muted
              playsInline
              autoPlay
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-accent/70"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-8 top-1/2 h-0.5 bg-accent shadow-[0_0_18px_rgba(30,215,96,0.9)]"
            />
          </div>

          <p className="mx-auto mt-6 max-w-xs text-center text-[12px] leading-relaxed text-gray-300">
            Kamera hanya dipakai untuk membaca QR. Setelah QR terbaca,
            kunjungan langsung tercatat otomatis.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function extractToken(text: string): string | null {
  try {
    const url = new URL(text);
    if (!url.pathname.endsWith("/checkin")) return null;
    return url.searchParams.get("k");
  } catch {
    return null;
  }
}

function cameraErrorMessage(error: unknown) {
  const name = (error as { name?: string } | null)?.name;

  if (name === "NotAllowedError") {
    return "Izin kamera ditolak. Aktifkan izin kamera di browser, lalu coba lagi.";
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "Kamera tidak ditemukan. Pastikan perangkat memiliki kamera.";
  }
  if (name === "NotReadableError") {
    return "Kamera sedang dipakai aplikasi lain. Tutup aplikasi tersebut lalu coba lagi.";
  }

  return "Kamera gagal dibuka. Coba lagi atau gunakan browser lain.";
}
