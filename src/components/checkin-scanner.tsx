"use client";

import { useCallback, useEffect, useRef, useState, startTransition } from "react";
import { createPortal } from "react-dom";
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
  rewardReady,
}: {
  initialToken?: string;
  invalidToken?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  rewardReady?: boolean;
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
  const [cameraReady, setCameraReady] = useState(false);
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
        if (result.freeVisit) {
          params.set("reward", "used");
          if (result.rewardCycle) {
            params.set("cycle", String(result.rewardCycle));
          }
        } else if (result.rewardEarned) {
          params.set("reward", "earned");
        }
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
              setCameraReady(false);
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
        setCameraReady(true);
      } catch (err) {
        if (cancelled) return;
        setCameraReady(false);
        setError(cameraErrorMessage(err));
        setPhase("error");
      }
    })();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [phase, stopCamera, submitToken]);

  useEffect(() => {
    if (phase !== "scanning") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  const disabledMessage = disabled
    ? (disabledReason ?? "Check-in belum tersedia saat ini.")
    : phase === "recording"
      ? "Memverifikasi QR dan mencatat kunjungan..."
      : rewardReady
        ? "Reward cukur gratis siap dipakai. Scan QR untuk mencatat cukur gratis."
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
            if (!navigator.mediaDevices?.getUserMedia) {
              setError(
                "Browser ini tidak mendukung kamera. Buka lewat Chrome/Safari dan pastikan halaman memakai HTTPS.",
              );
              return;
            }
            setError(null);
            setCameraReady(false);
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
              : rewardReady
                ? "Scan QR & pakai reward"
                : "Scan QR & catat kunjungan"}
        </button>
      )}

      <p className="text-center text-[11px] leading-relaxed text-muted">
        {disabledMessage}
      </p>

      {phase === "scanning" && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex flex-col bg-black">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
                autoPlay
                onPlaying={() => setCameraReady(true)}
              />

              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-black/85"
              />

              <div
                className="relative z-10 flex items-center justify-between px-5"
                style={{
                  paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)",
                }}
              >
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
                  onClick={() => {
                    setCameraReady(false);
                    setPhase("idle");
                  }}
                  aria-label="Tutup kamera"
                  className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="relative z-10 flex flex-1 items-center justify-center px-8">
                <div className="relative aspect-square w-full max-w-[280px]">
                  <span className="absolute left-0 top-0 size-9 rounded-tl-2xl border-l-2 border-t-2 border-accent" />
                  <span className="absolute right-0 top-0 size-9 rounded-tr-2xl border-r-2 border-t-2 border-accent" />
                  <span className="absolute bottom-0 left-0 size-9 rounded-bl-2xl border-b-2 border-l-2 border-accent" />
                  <span className="absolute bottom-0 right-0 size-9 rounded-br-2xl border-b-2 border-r-2 border-accent" />
                  <span
                    aria-hidden
                    className="absolute inset-x-3 top-1/2 h-0.5 -translate-y-1/2 bg-accent shadow-[0_0_18px_rgba(30,215,96,0.95)]"
                  />

                  {!cameraReady ? (
                    <div className="absolute inset-0 grid place-items-center rounded-2xl bg-black/40">
                      <div className="flex flex-col items-center gap-2 text-white">
                        <Loader2 className="size-6 animate-spin text-accent" />
                        <p className="text-[12px] font-semibold">
                          Membuka kamera...
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div
                className="relative z-10 px-6 text-center"
                style={{
                  paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)",
                }}
              >
                <p className="mx-auto max-w-xs text-[12px] leading-relaxed text-gray-300">
                  Posisikan QR di dalam kotak. Setelah QR terbaca,{" "}
                  {rewardReady
                    ? "reward cukur gratis akan ditandai terpakai."
                    : "kunjungan langsung tercatat otomatis."}
                </p>
                <p className="mx-auto mt-2 max-w-xs text-[10px] leading-relaxed text-gray-500">
                  Jika kamera tidak muncul, izinkan akses kamera di browser lalu
                  tekan scan ulang.
                </p>
              </div>
            </div>,
            document.body,
          )
        : null}
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
  if (name === "SecurityError") {
    return "Akses kamera diblokir. Buka halaman ini lewat Chrome/Safari dengan HTTPS.";
  }

  return "Kamera gagal dibuka. Coba lagi atau gunakan browser lain.";
}
