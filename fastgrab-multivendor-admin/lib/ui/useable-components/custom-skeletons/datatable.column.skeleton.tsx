import { Skeleton } from 'primereact/skeleton';

export default function DataTableColumnSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton width="100%" height="1.5rem" borderRadius="0"></Skeleton>
    </div>
  );
}
