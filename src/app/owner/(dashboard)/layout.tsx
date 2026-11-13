import { Brand } from "@/components/brand";
import { OwnerLogoutButton } from "@/components/owner-logout-button";
import { OwnerNav } from "@/components/owner-nav";
import { Badge } from "@/components/ui";
import { requireOwner } from "@/lib/auth";

export default async function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const owner = await requireOwner();

  return (
    <div className="min-h-dvh bg-paper lg:flex">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-paper px-4 py-5 lg:flex">
        <Brand href="/owner" />
        <div className="mt-9 flex-1">
          <p className="px-4 text-[9px] font-bold uppercase tracking-[0.22em] text-muted">
            Manajemen
          </p>
          <div className="mt-2.5">
            <OwnerNav />
          </div>
        </div>
        <div className="rounded-[22px] border border-line bg-surface p-3.5 shadow-[var(--shadow-card)]">
          <div className="mb-2.5 flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-accent text-[10px] font-bold text-black">
              OW
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-ink">
                {owner.name}
              </p>
              <Badge tone="muted" className="mt-1 px-2 py-0.5 text-[8px]">
                Owner
              </Badge>
            </div>
          </div>
          <OwnerLogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="safe-top sticky top-0 z-30 flex items-center justify-between border-b border-line bg-paper px-4 py-3 lg:hidden">
          <Brand href="/owner" />
          <OwnerLogoutButton className="w-auto" />
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+6rem)] pt-5 lg:px-10 lg:pb-12 lg:pt-8">
          {children}
        </main>
      </div>

      <OwnerNav variant="bottom" />
    </div>
  );
}
