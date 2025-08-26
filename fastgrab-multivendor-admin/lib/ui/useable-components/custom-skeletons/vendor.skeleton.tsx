import { Skeleton } from 'primereact/skeleton';

export default function CustomVendorSkeleton() {
  return (
    <div className="flex items-center p-2 px-3">
      <Skeleton shape="circle" size="40px" className="mr-3" />
      <div className="flex flex-1 flex-col gap-y-1">
        <Skeleton width="150px" className="mb-2" />
        <Skeleton width="200px" className="mb-2" />
        <div className="flex items-center">
          <Skeleton width="20px" height="20px" className="mr-2" />
          <Skeleton width="30px" />
        </div>
      </div>
      <Skeleton width="20px" height="20px" />
    </div>
  );
}
