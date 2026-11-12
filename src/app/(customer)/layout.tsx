import { redirect } from "next/navigation";
import { CustomerNav } from "@/components/customer-nav";
import { getSession } from "@/lib/auth";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "member") redirect("/masuk");

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-md overflow-x-hidden bg-paper shadow-[0_0_80px_rgba(0,0,0,0.9)]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-full -translate-x-1/2 rounded-full bg-accent/10 blur-[100px]"
      />
      <main
        className="relative min-h-dvh px-5 pb-36"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
      >
        {children}
      </main>
      <CustomerNav />
    </div>
  );
}
