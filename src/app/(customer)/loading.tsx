export default function CustomerLoading() {
  return (
    <div aria-hidden className="animate-pulse space-y-6">
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-surface-2" />
          <div className="space-y-2">
            <div className="h-2.5 w-16 rounded-full bg-surface-2" />
            <div className="h-4 w-28 rounded-full bg-surface-2" />
          </div>
        </div>
        <div className="size-11 rounded-full bg-surface-2" />
      </div>

      <div className="h-[188px] rounded-[28px] bg-surface-2" />
      <div className="h-[76px] rounded-[22px] bg-surface-2" />

      <div>
        <div className="mb-3 h-3.5 w-24 rounded-full bg-surface-2" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="size-14 rounded-full bg-surface-2" />
              <div className="h-2.5 w-10 rounded-full bg-surface-2" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 h-3.5 w-32 rounded-full bg-surface-2" />
        <div className="flex gap-2.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-[76px] w-[72px] shrink-0 rounded-[20px] bg-surface-2"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
