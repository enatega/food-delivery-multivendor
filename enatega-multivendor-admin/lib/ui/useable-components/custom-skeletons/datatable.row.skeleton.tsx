import { Skeleton } from 'primereact/skeleton';

export default function DataTableRowSkeleton() {
  return (
    <div className="flex items-center p-2 dark:bg-dark-950">
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


export function DataTableBreakdownRowSkeleton() {
  return (
    <div className="flex items-center p-2 space-x-3">
      {/* Column 1: Circle (like avatar) */}
      <Skeleton shape="circle" size="2.5rem" />

      {/* Column 2 */}
      <div className="flex-1">
        <Skeleton width="70%" height="1rem" className="mb-2" />
        <Skeleton width="40%" height="0.75rem" />
      </div>

      {/* Column 3 */}
      <Skeleton width="15%" height="1rem" />

      {/* Column 4 */}
      <Skeleton width="15%" height="1rem" />

      {/* Column 5 */}
      <Skeleton width="15%" height="1rem" />

      {/* Column 6 */}
      <Skeleton width="15%" height="1rem" />
    </div>
  );
}