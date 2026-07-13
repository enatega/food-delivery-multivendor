import React from 'react';
import { Skeleton } from 'primereact/skeleton';

export const BannerRestaurantSkeleton = () => {
  return (
    <div className="p-4">
      <div className="mb-4">
        <Skeleton width="20%" height="2rem" />
      </div>
      <div className="mb-4">
        <Skeleton width="30%" height="2rem" />
      </div>
      <div className="mb-4 grid grid-cols-4 gap-4">
        <Skeleton width="100%" height="6rem" />
        <Skeleton width="100%" height="6rem" />
        <Skeleton width="100%" height="6rem" />
        <Skeleton width="100%" height="6rem" />
      </div>
      <div className="mb-4">
        <Skeleton width="100%" height="20rem" />
      </div>
    </div>
  );
};

export default BannerRestaurantSkeleton;