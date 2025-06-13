import { Skeleton } from 'primereact/skeleton';

export default function CustomRestaurantCardSkeleton() {
  return (
    <div className="flex flex-col rounded-lg border-2 border-[#F4F4F5] bg-white shadow-md">
      <div className="mb-4 flex items-center rounded-t-lg bg-gray-200 p-4">
        <Skeleton shape="circle" size="3rem" className="mr-3" />
        <div className="min-w-0 flex-grow">
          <Skeleton width="70%" height="1.5rem" className="mb-2" />
          <Skeleton width="50%" height="1rem" />
        </div>
        <Skeleton width="3rem" height="1.5rem" className="ml-2" />
      </div>
      <div className="mb-4 flex items-center gap-x-2 px-4 text-sm text-gray-500">
        <Skeleton width="1rem" height="1rem" className="mr-2" />
        <Skeleton width="80%" height="1rem" />
      </div>
      <div className="mb-2 px-4">
        <Skeleton width="100%" height="2.5rem" />
      </div>
    </div>
  );
}
