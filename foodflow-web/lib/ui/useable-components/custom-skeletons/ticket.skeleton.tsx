"use client";

interface ITicketSkeletonProps {
  count?: number;
}

export default function TicketSkeleton({ count = 3 }: ITicketSkeletonProps) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="w-full">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}