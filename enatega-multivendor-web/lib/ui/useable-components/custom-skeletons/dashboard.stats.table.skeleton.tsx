import React from 'react';
import { Skeleton } from 'primereact/skeleton';

export default function DashboardStatsTableSkeleton() {
  return (
    <div className="w-full mx-auto mt-10">
      <div className="skeleton-ring rounded-lg border bg-dispatch-surface shadow-md">
        <div className="skeleton-surface flex items-center justify-between rounded-t-lg p-4">
          <Skeleton width="40%" height="24px" className="mb-2" />
          <Skeleton shape="circle" size="24px" />
        </div>
        <div className="p-4 max-h-40 overflow-y-auto">
          <div className="flex justify-between py-2">
            <Skeleton width="40%" height="20px" />
            <Skeleton width="20%" height="20px" />
          </div>
          <div className="flex justify-between py-2">
            <Skeleton width="40%" height="20px" />
            <Skeleton width="20%" height="20px" />
          </div>
          <div className="flex justify-between py-2">
            <Skeleton width="40%" height="20px" />
            <Skeleton width="20%" height="20px" />
          </div>
        </div>
      </div>
    </div>
  );
}
