import { Skeleton } from 'primereact/skeleton';

export default function DataTableRowSkeleton() {
  return (
    <div className="flex items-center p-2">
      <Skeleton shape="circle" size="2.5rem" className="mr-3"></Skeleton>
      <div className="flex-1">
        <Skeleton width="70%" height="1rem" className="mb-2"></Skeleton>
        <Skeleton width="40%" height="0.75rem"></Skeleton>
      </div>
      <Skeleton width="10%" height="1rem" className="mr-2"></Skeleton>
      <Skeleton width="15%" height="1rem"></Skeleton>
    </div>
  );
}
