import { Skeleton } from 'primereact/skeleton';

const TimeInputSkeleton = () => {
  return (
    <div className="w-full">
      <Skeleton width="100%" height="2.5rem" className="h-10" />
    </div>
  );
};

export default TimeInputSkeleton;
