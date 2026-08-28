import { Skeleton } from 'primereact/skeleton';

export default function DashboardStatsCardSkeleton() {
  return (
    <div className="card cursor-pointer dark:bg-dark-950">
      <div className="mb-2 flex items-center justify-between">
        <Skeleton width="60%" height="1rem" className="mb-2"></Skeleton>
        <Skeleton shape="circle" size="2.5rem"></Skeleton>
      </div>
      <Skeleton width="80%" height="2rem" className="mb-2"></Skeleton>
      <Skeleton width="40%" height="1rem"></Skeleton>
    </div>
  );
}
