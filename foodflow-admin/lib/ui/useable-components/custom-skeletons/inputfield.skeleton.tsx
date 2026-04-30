import { Skeleton } from 'primereact/skeleton';

const InputSkeleton = () => {
  return (
    <div className="w-full space-y-2 dark:bg-dark-950">
      <Skeleton width="15%" height="0.8rem" className="h-10" />
      <Skeleton width="100%" height="2.97rem" className="h-10" />
    </div>
  );
};

export default InputSkeleton;
