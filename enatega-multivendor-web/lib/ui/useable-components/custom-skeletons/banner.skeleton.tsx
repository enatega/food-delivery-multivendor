export default function DiscoveryBannerSkeleton({
  single: _single = false,
}: {
  single?: boolean;
}) {
  return (
    <div
      className="mt-5 grid sm:mt-7 lg:grid-cols-[minmax(0,1fr)_240px] xl:grid-cols-[minmax(0,1fr)_280px]"
      aria-hidden="true"
    >
      <div className="skeleton-surface relative z-10 h-[260px] overflow-hidden rounded-[28px] sm:h-[320px] lg:h-[390px] lg:rounded-r-[195px]">
        <div className="absolute bottom-7 left-6 w-[58%] space-y-3 sm:bottom-9 sm:left-9">
          <div className="skeleton-line h-3 w-24 animate-pulse rounded-full" />
          <div className="skeleton-line h-8 w-3/4 animate-pulse rounded" />
          <div className="skeleton-line h-4 w-full animate-pulse rounded" />
          <div className="skeleton-line h-10 w-28 animate-pulse rounded-xl" />
        </div>
      </div>
      <div className="relative z-20 mt-3 flex gap-4 overflow-hidden py-2 lg:-ml-6 lg:mt-0 lg:block lg:h-[390px] lg:overflow-visible lg:py-0">
        {[
          "lg:left-7 lg:top-[33px]",
          "lg:left-[62px] lg:top-[152px]",
          "lg:left-7 lg:top-[271px]",
        ].map((position, item) => (
          <div
            key={item}
            className={`flex shrink-0 items-center gap-4 lg:absolute ${position}`}
          >
            <div className="skeleton-surface h-[78px] w-[78px] animate-pulse rounded-full lg:h-[86px] lg:w-[86px]" />
            <div className="skeleton-line hidden h-3 w-20 animate-pulse rounded-full sm:block" />
          </div>
        ))}
        <div className="mt-3 ml-auto flex items-center gap-2 lg:absolute lg:bottom-0 lg:right-0 lg:mt-0">
          <div className="skeleton-surface h-10 w-10 animate-pulse rounded-full" />
          <div className="skeleton-surface h-10 w-10 animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
}
