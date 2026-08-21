const VendorPlaceholder = () => (
  <div className="overflow-hidden rounded-xl border border-dispatch-line bg-dispatch-surface">
    <div className="aspect-[16/9] animate-pulse bg-dispatch-map" />
    <div className="space-y-2 p-2.5">
      <div className="space-y-2">
        <div className="h-4 w-3/4 animate-pulse bg-dispatch-line" />
        <div className="h-3 w-1/2 animate-pulse bg-dispatch-line" />
      </div>
      <div className="flex gap-3 pt-1">
        <div className="h-3 w-12 animate-pulse bg-dispatch-line" />
        <div className="h-3 w-12 animate-pulse bg-dispatch-line" />
        <div className="h-3 w-12 animate-pulse bg-dispatch-line" />
      </div>
    </div>
  </div>
);

export default function SliderSkeleton() {
  return (
    <section className="mt-5" aria-hidden="true">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-8 w-52 animate-pulse bg-dispatch-line" />
        <div className="hidden gap-2 md:flex">
          <div className="h-9 w-9 animate-pulse rounded-full bg-dispatch-map" />
          <div className="h-9 w-9 animate-pulse rounded-full bg-dispatch-map" />
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
