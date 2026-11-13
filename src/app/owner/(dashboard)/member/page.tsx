import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Search, Ticket, Users } from "lucide-react";
import { Avatar, Badge, EmptyState, ProgressBar } from "@/components/ui";
import { inputClass } from "@/components/field";
import { listMembers } from "@/lib/loyalty";
import { formatPhone, formatShortDate, initials } from "@/lib/utils";

export const metadata: Metadata = { title: "Database Member" };

export default async function MemberListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; hapus?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const members = await listMembers(query);

  return (
    <div className="space-y-6">
      <header className="animate-rise">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
          Database member
        </p>
        <h1 className="mt-1 text-balance font-display text-[clamp(2rem,8vw,2.6rem)] leading-[0.98] tracking-[-0.02em] text-ink">
          Member Kembabershop.
        </h1>
        <p className="mt-2 text-[13px] text-muted">
          {members.length} member
          {query ? ` cocok dengan “${query}”` : " terdaftar"}.
        </p>
      </header>

      {params.hapus === "sukses" ? (
        <div className="animate-rise rounded-2xl border border-accent/15 bg-accent-soft px-4 py-3 text-[12px] font-medium text-accent">
          Akun member dan seluruh riwayat kunjungan serta reward berhasil
          dihapus.
        </div>
      ) : null}
      {params.hapus === "gagal" ? (
        <div className="animate-rise rounded-2xl border border-bad/20 bg-bad-soft px-4 py-3 text-[12px] font-medium text-bad">
          Member tidak ditemukan atau sudah dihapus sebelumnya.
        </div>
      ) : null}

      <form action="/owner/member" className="animate-rise relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
          name="q"
          type="search"
          defaultValue={query}
          autoCapitalize="none"
          enterKeyHint="search"
          aria-label="Cari member"
          placeholder="Cari nama atau nomor HP..."
          className={`${inputClass} rounded-full pl-11`}
        />
      </form>

      {members.length === 0 ? (
        <EmptyState
          icon={<Users className="size-6" />}
          title={query ? "Member tidak ditemukan" : "Belum ada member"}
          description={
            query
              ? "Coba kata kunci lain atau periksa ejaan."
              : "Member akan muncul di sini setelah melakukan registrasi."
          }
        />
      ) : (
        <div className="animate-rise divide-y divide-line overflow-hidden rounded-[26px] border border-line bg-surface shadow-[var(--shadow-card)]">
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/owner/member/${member.id}`}
              className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2"
            >
              <Avatar
                initials={initials(member.name)}
                className="size-10 text-[11px]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[12px] font-semibold text-ink">
                    {member.name}
                  </p>
                  {member.stats.hasRewardReady ? (
                    <Badge tone="accent" className="shrink-0">
                      <Ticket className="size-2.5" /> Reward
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-0.5 text-[10px] text-muted">
                  {formatPhone(member.phone)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <ProgressBar
                    value={member.stats.progress}
                    max={member.stats.target}
                    className="h-1 max-w-[180px] flex-1"
                  />
                  <span className="text-[9px] font-bold tabular-nums text-accent">
                    {member.stats.progress}/{member.stats.target}
                  </span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-[1.3rem] leading-none tabular-nums text-ink">
                  {member.stats.paidVisits}
                </p>
                <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.1em] text-muted">
                  cukur
                </p>
                {member.lastVisitAt ? (
                  <p className="mt-0.5 text-[9px] text-muted">
                    {formatShortDate(member.lastVisitAt)}
                  </p>
                ) : null}
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted/50" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
