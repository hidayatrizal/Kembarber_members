import type { Metadata } from "next";
import { Images } from "lucide-react";
import { ShopHistoryForm } from "@/components/shop-history-form";
import { getShopHistorySettings } from "@/lib/shop";

export const metadata: Metadata = { title: "Pengaturan Toko" };

export default async function OwnerSettingsPage() {
  const { historyImageUrl } = await getShopHistorySettings();

  return (
    <div className="space-y-6">
      <header className="animate-rise">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
          Toko
        </p>
        <h1 className="mt-1 text-balance font-display text-[clamp(2rem,8vw,2.6rem)] leading-[0.98] tracking-[-0.02em] text-ink">
          Pengaturan.
        </h1>
        <p className="mt-2 text-[13px] text-muted">
          Kelola tampilan halaman welcome Kembabershop.
        </p>
      </header>

      <section className="animate-rise rounded-[26px] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
            <Images className="size-4" strokeWidth={2} aria-hidden />
          </span>
          <div>
            <h2 className="text-[14px] font-bold text-ink">Foto sejarah</h2>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
              Foto ini tampil di kartu sejarah halaman welcome.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <ShopHistoryForm imageUrl={historyImageUrl} />
        </div>
      </section>
    </div>
  );
}
