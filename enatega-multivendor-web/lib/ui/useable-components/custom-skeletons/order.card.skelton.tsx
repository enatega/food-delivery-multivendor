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
        "p-6 bg-white rounded-lg shadow-md animate-pulse", 
        className
      )}
    >
      {/* Restaurant Info Section */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Restaurant Image */}
        <div className="flex items-start gap-4 flex-1">
          <div className="w-16 h-16 bg-gray-300 rounded-md flex-shrink-0"></div>
          
          {/* Restaurant Details */}
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-5 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex md:flex-col md:items-end justify-between gap-2">
          <div className="h-6 bg-gray-300 rounded w-20"></div>
          <div className="h-8 bg-gray-300 rounded w-24"></div>
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