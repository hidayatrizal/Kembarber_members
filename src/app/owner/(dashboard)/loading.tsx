export default function OwnerLoading() {
  return (
    <div aria-hidden className="animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-2.5 w-24 rounded-full bg-surface-2" />
        <div className="h-8 w-64 max-w-full rounded-full bg-surface-2" />
        <div className="h-3 w-72 max-w-full rounded-full bg-surface-2" />
      </div>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[148px] rounded-[24px] bg-surface-2" />
        ))}
      </div>

      <div className="h-[92px] rounded-[26px] bg-surface-2" />

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[248px] rounded-[26px] bg-surface-2" />
        ))}
      </div>
    </div>
  );
}
