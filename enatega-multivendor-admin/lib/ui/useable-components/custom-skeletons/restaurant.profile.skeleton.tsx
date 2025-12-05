import React from 'react';

const RestaurantProfileSkeleton = () => {
  return (
    <div className="mt-8 flex animate-pulse items-center justify-center">
      <div className="w-full rounded border-2 border-dotted border-inherit bg-white dark:bg-dark-950 p-8">
        <div className="mb-6 flex items-center">
          <div className="h-14 w-14 rounded-full bg-gray-300"></div>
          <div className="ml-2">
            <div className="mb-2 h-4 w-24 rounded bg-gray-300"></div>
            <div className="h-6 w-48 rounded bg-gray-300"></div>
          </div>
        </div>
        <hr className="mb-6" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[...Array(9)].map((_, index) => (
            <div key={index}>
              <div className="mb-2 h-4 w-24 rounded bg-gray-300"></div>
              <div className="h-6 w-32 rounded bg-gray-300"></div>
            </div>
          ))}
          <div className="md:row-span-4">
            <div className="mb-4 h-4 w-24 rounded bg-gray-300"></div>
            <div className="flex space-x-2">
              <div className="h-24 w-24 rounded bg-gray-300"></div>
              <div className="h-24 w-24 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfileSkeleton;
