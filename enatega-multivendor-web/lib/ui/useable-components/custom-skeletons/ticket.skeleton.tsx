"use client";

interface ITicketSkeletonProps {
  count?: number;
}

export default function TicketSkeleton({ count = 3 }: ITicketSkeletonProps) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="skeleton-ring animate-pulse rounded-lg border bg-dispatch-surface p-4 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-full">
              <div className="skeleton-line mb-2 h-6 w-1/3 rounded"></div>
              <div className="skeleton-line h-4 w-1/4 rounded"></div>
            </div>
            <div className="skeleton-line h-6 w-20 rounded-full"></div>
          </div>
          <div className="flex justify-between">
            <div className="skeleton-line h-4 w-1/4 rounded"></div>
            <div className="skeleton-line h-4 w-1/4 rounded"></div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
            <div className="skeleton-line h-8 w-24 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
