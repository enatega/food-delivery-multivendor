import { Skeleton } from 'primereact/skeleton';

export default function DashboardUsersByYearStatsSkeleton() {
  return (
    <div className="card cursor-pointer">
      <div className="mb-4 flex justify-center space-x-2">
        <Skeleton width="5%" height="1rem"></Skeleton>
        <Skeleton width="5%" height="1rem"></Skeleton>
        <Skeleton width="5%" height="1rem"></Skeleton>
        <Skeleton width="5%" height="1rem"></Skeleton>
      </div>

      <div className="mt-2 flex justify-between">
        <Skeleton width="100%" height="25rem"></Skeleton>
      </div>
    </div>
  );
}
