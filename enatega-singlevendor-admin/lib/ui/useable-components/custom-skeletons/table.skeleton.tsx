import { Skeleton } from 'primereact/skeleton';

const TableSkeleton = () => {
  return (
    <div className="mt-8 w-full space-y-3">
      <Skeleton width="19%" height="2.65rem" />
      <div className="flex flex-col gap-2 bg-[#f4f4f500]">
        <Skeleton width="100%" height="2.47rem" />
        <div className="flex flex-col divide-y divide-[#cccccc9c]">
          {Array.from({ length: 5 }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="flex h-10 items-center justify-between gap-2"
            >
              {[1, 2, 3, 4, 5].map((_, i) => {
                return <Skeleton key={i} width="18%" height="1rem" />;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
