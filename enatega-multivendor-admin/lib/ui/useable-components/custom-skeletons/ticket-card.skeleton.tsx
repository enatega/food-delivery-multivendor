// Path: /lib/ui/useable-components/custom-skeletons/ticket-card.skeleton.tsx

'use client';

interface ITicketCardSkeletonProps {
  count?: number;
}

export default function TicketCardSkeleton({
  count = 3,
}: ITicketCardSkeletonProps) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse flex-col border-b border-gray-200 p-3 dark:border-dark-600"
        >
          {/* Title and status */}
          <div className="mb-2 flex items-start justify-between">
            <div className="mb-2 h-6 w-2/5 rounded bg-gray-200 dark:bg-dark-700"></div>
            <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-dark-700"></div>
          </div>

          {/* Category and order ID */}
          <div className="mb-2 flex">
            <div className="mr-3 h-4 w-1/4 rounded bg-gray-200 dark:bg-dark-700"></div>
            <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-dark-700"></div>
          </div>

          {/* Description */}
          <div className="mb-1 h-4 w-full rounded bg-gray-200 dark:bg-dark-700"></div>
          <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-dark-700"></div>

          {/* Created and updated dates */}
          <div className="mt-2 flex justify-between">
            <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-dark-700"></div>
            <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-dark-700"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
