"use client";

export default function AddressesSkeleton() {
  return (
    <div className="w-full mx-auto">
      {/* Skeleton for Address Items */}
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-center justify-between p-4 border-b animate-pulse">
          <div className="flex items-center">
            {/* Icon Skeleton */}
            <div className="mr-4 h-7 w-7 bg-gray-300 rounded"></div>
            <div>
              {/* Label Skeleton */}
              <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
              {/* Address Details Skeleton */}
              <div className="h-4 w-48 bg-gray-300 rounded"></div>
            </div>
          </div>
          {/* Menu Icon Skeleton */}
          <div className="h-7 w-7 bg-gray-300 rounded"></div>
        </div>
      ))}

      {/* Skeleton for "Add New Address" Button */}
      <div className="flex justify-center mt-16">
        <div className="h-10 w-48 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
