import React from 'react';
import { Skeleton } from 'primereact/skeleton';

export default function DashboardStatsTableSkeleton() {
  return (
    <div className="w-full mx-auto mt-10">
      <div className="bg-white dark:bg-dark-950 shadow-md rounded-lg border border-gray-300">
        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-t-lg">
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
