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
          className="flex flex-col border-b dark:bg-dark-950 border-gray-200 p-3 animate-pulse"
        >
          {/* Title and status */}
          <div className="flex justify-between items-start mb-2">
            <div className="h-6 bg-gray-200 dark:bg-dark-950 rounded w-2/5 mb-2"></div>
            <div className="h-5 bg-gray-200 dark:bg-dark-950 rounded-full w-20"></div>
          </div>

          {/* Category and order ID */}
          <div className="flex mb-2">
            <div className="h-4 bg-gray-200 dark:bg-dark-950 rounded w-1/4 mr-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-dark-950 rounded w-1/4"></div>
          </div>

          {/* Description */}
          <div className="h-4 bg-gray-200 dark:bg-dark-950 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-200 dark:bg-dark-950 rounded w-3/4 mb-2"></div>

          {/* Created and updated dates */}
          <div className="flex justify-between mt-2">
            <div className="h-3 bg-gray-200 dark:bg-dark-950 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-dark-950  rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
