import React from 'react';
import { twMerge } from 'tailwind-merge';

interface OrderCardSkeletonProps {
  count?: number;
  className?: string;
}

const OrderCardSkeleton: React.FC<OrderCardSkeletonProps> = ({ 
  count = 1, 
  className 
}) => {
  const skeletonItems = Array.from({ length: count }, (_, index) => (
    <div 
      key={index} 
      className={twMerge(
        "p-6 bg-dispatch-surface rounded-lg shadow-md animate-pulse", 
        className
      )}
    >
      {/* Restaurant Info Section */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Restaurant Image */}
        <div className="flex items-start gap-4 flex-1">
          <div className="skeleton-surface h-16 w-16 flex-shrink-0 rounded-md"></div>
          
          {/* Restaurant Details */}
          <div className="flex-1 space-y-2">
            <div className="skeleton-line h-6 w-3/4 rounded"></div>
            <div className="skeleton-line h-5 w-1/2 rounded"></div>
            <div className="skeleton-line h-4 w-2/3 rounded"></div>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex md:flex-col md:items-end justify-between gap-2">
          <div className="skeleton-line h-6 w-20 rounded"></div>
          <div className="skeleton-line h-8 w-24 rounded"></div>
        </div>
      </div>

      {/* Rating Section */}
      {/* <div className="mt-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        </div>
      </div> */}
    </div>
  ));

  return (
    <div className="space-y-4">
      {skeletonItems}
    </div>
  );
};

export default OrderCardSkeleton;
