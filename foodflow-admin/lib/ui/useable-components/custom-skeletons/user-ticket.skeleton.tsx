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
          className="flex items-center p-3 border-b border-gray-200 dark:bg-dark-950 animate-pulse"
        >
          {/* Avatar circle */}
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-dark-950 mr-3"></div>

          <div className="flex-1">
            {/* Name */}
            <div className="flex justify-between items-center mb-1">
              <div className="h-5 bg-gray-200 dark:bg-dark-950 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 dark:bg-dark-950 rounded w-1/6"></div>
            </div>

            {/* Ticket title */}
            <div className="h-4 bg-gray-200 dark:bg-dark-950 rounded w-2/3 mb-1"></div>

            {/* Email */}
            <div className="h-3 bg-gray-200 dark:bg-dark-950 rounded w-1/2 mb-1"></div>

            {/* Status badge */}
            <div className="h-5 bg-gray-200 dark:bg-dark-950 rounded-full w-16 mt-1"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
