// Path: /lib/ui/useable-components/custom-skeletons/user-ticket.skeleton.tsx

'use client';

interface IUserTicketSkeletonProps {
  count?: number;
}

export default function UserTicketSkeleton({
  count = 5,
}: IUserTicketSkeletonProps) {
  return (
    <div className="space-y-0 dark:bg-dark-950">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center border-b border-gray-200 p-3 dark:border-dark-600"
        >
          {/* Avatar circle */}
          <div className="mr-3 h-10 w-10 rounded-full bg-gray-200 dark:bg-dark-700"></div>

          <div className="flex-1">
            {/* Name */}
            <div className="mb-1 flex items-center justify-between">
              <div className="h-5 w-1/3 rounded bg-gray-200 dark:bg-dark-700"></div>
              <div className="h-3 w-1/6 rounded bg-gray-200 dark:bg-dark-700"></div>
            </div>

            {/* Ticket title */}
            <div className="mb-1 h-4 w-2/3 rounded bg-gray-200 dark:bg-dark-700"></div>

            {/* Email */}
            <div className="mb-1 h-3 w-1/2 rounded bg-gray-200 dark:bg-dark-700"></div>

            {/* Status badge */}
            <div className="mt-1 h-5 w-16 rounded-full bg-gray-200 dark:bg-dark-700"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
