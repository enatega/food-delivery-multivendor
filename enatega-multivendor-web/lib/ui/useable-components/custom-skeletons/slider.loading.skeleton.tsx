const VendorPlaceholder = () => (
  <div className="skeleton-ring overflow-hidden rounded-xl border bg-dispatch-surface">
    <div className="skeleton-surface aspect-[16/9] animate-pulse" />
    <div className="space-y-2 p-2.5">
      <div className="space-y-2">
        <div className="skeleton-line h-4 w-3/4 animate-pulse" />
        <div className="skeleton-line h-3 w-1/2 animate-pulse" />
      </div>
      <div className="flex gap-3 pt-1">
        <div className="skeleton-line h-3 w-12 animate-pulse" />
        <div className="skeleton-line h-3 w-12 animate-pulse" />
        <div className="skeleton-line h-3 w-12 animate-pulse" />
      </div>
    </div>
  </div>
);

export default function SliderSkeleton() {
  return (
    <section className="mt-5" aria-hidden="true">
      <div className="mb-4 flex items-center justify-between">
        <div className="skeleton-line h-8 w-52 animate-pulse" />
        <div className="hidden gap-2 md:flex">
          <div className="skeleton-surface h-9 w-9 animate-pulse rounded-full" />
          <div className="skeleton-surface h-9 w-9 animate-pulse rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 max-[320px]:grid-cols-1 min-[641px]:grid-cols-4 min-[1025px]:grid-cols-5 min-[1281px]:grid-cols-6 min-[1537px]:grid-cols-8">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index}>
            <VendorPlaceholder />
          </div>
        ))}
      </div>
    </section>
  );
}
