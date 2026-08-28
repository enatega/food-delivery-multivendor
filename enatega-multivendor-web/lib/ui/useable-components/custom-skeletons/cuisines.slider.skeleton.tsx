const CuisinePlaceholder = ({
  showDescription,
}: {
  showDescription: boolean;
}) => (
  <div className="overflow-hidden rounded-xl bg-dispatch-surface">
    <div
      className={`skeleton-surface skeleton-ring animate-pulse ring-1 ${showDescription ? "mx-auto aspect-square max-w-28 rounded-full" : "aspect-[3/2] rounded-xl"}`}
    />
    <div className="px-1 pt-2">
      <div className="skeleton-line h-4 w-3/4 animate-pulse rounded" />
    </div>
  </div>
);

export default function CuisinesSliderSkeleton({
  showDescription = false,
}: {
  showDescription?: boolean;
}) {
  return (
    <section className="mt-5" aria-hidden="true">
      <div className="mb-4 flex items-center justify-between">
        <div className="skeleton-line h-7 w-44 animate-pulse rounded" />
        <div className="hidden gap-2 md:flex">
          <div className="skeleton-surface h-9 w-9 animate-pulse rounded-full" />
          <div className="skeleton-surface h-9 w-9 animate-pulse rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 min-[641px]:grid-cols-3 min-[1025px]:grid-cols-6 min-[1281px]:grid-cols-8 min-[1537px]:grid-cols-10">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index}>
            <CuisinePlaceholder showDescription={showDescription} />
          </div>
        ))}
      </div>
    </section>
  );
}
