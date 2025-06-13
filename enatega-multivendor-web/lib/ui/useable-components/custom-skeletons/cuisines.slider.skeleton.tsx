"use client";

import React from "react";
import { Carousel } from "primereact/carousel";

const responsiveOptions = [
  { breakpoint: "1024px", numVisible: 4, numScroll: 1 },
  { breakpoint: "768px", numVisible: 3, numScroll: 1 },
  { breakpoint: "560px", numVisible: 2, numScroll: 1 },
  { breakpoint: "425px", numVisible: 1, numScroll: 1 },
];

const CardSkeleton = () => {
  return (
    <div className="max-w-[402px] max-h-[272px] md:w-[180px] lg:w-[180px] xl:w-[270px] 2xl:w-[380px] rounded-md shadow-md m-2 mb-6 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full h-[140px] bg-gray-300 rounded-t-md"></div>

      {/* Content Skeleton */}
      <div className="p-2 flex flex-col">
        <div className="flex justify-between items-center border-b border-dashed pb-1">
          <div className="w-[70%]">
            <div className="h-4 bg-gray-300 mb-2 w-3/4 rounded"></div>
            <div className="h-3 bg-gray-300 w-1/2 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};


const CuisinesSliderSkeleton = () => {
  const numVisible = 4;

  return (
    <div className="ml-8 mr-10 md:ml-12 md:mr-14 mb-20 mt-6">
      <div className="flex justify-between mb-4">
        <div className="bg-gray-300 h-8 w-1/3 mb-2 rounded"></div>
        <div className="flex items-center justify-end gap-x-2">
          <span className="text-gray-300 text-sm">See All</span>
          <div className="gap-x-2 hidden md:flex">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      <Carousel
        value={[1, 2, 3, 4]}
        itemTemplate={() => <CardSkeleton />}
        numVisible={numVisible}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        showIndicators={false}
        showNavigators={false}
      />
    </div>
  );
};

export default CuisinesSliderSkeleton;