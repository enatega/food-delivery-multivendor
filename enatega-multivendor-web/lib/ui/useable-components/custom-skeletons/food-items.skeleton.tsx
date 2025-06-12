import { Skeleton } from "primereact/skeleton";

export default function FoodCategorySkeleton({ count = 6 }) {
  return (
    <div className="mb-4 p-3 w-full">
      <Skeleton width="12rem" height="2rem" className="mb-4" />

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 rounded-lg border border-gray-300 shadow-sm bg-white p-3 relative"
          >
            {/* Text Skeleton */}
            <div className="flex-grow text-left md:text-left space-y-2">
              <Skeleton width="60%" height="1.5rem" />
              <Skeleton width="80%" height="1rem" />
              <Skeleton width="40%" height="1.25rem" />
            </div>

            {/* Image Skeleton */}
            <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28">
              <Skeleton width="100%" height="100%" borderRadius="8px" />
            </div>

            {/* Plus Icon Skeleton */}
            <div className="absolute top-2 right-2">
              <Skeleton shape="circle" size="1.5rem" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
