const ProfileCardSkeleton = () => {
  return (
    <div className="space-y-2 m-3 mt-12">
      {' '}
      {/* This will create space between skeletons */}
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-4 border rounded-lg mt-4 animate-pulse"
        >
          <div className="flex flex-col md:flex-row items-center w-full">
            {/* Image Skeleton */}
            <div className="skeleton-surface mr-4 h-12 w-12 rounded-md"></div>

            <div className="flex-grow text-center md:text-left">
              {/* Name Skeleton */}
              <div className="skeleton-line mb-2 h-4 w-32 rounded"></div>

              {/* Job Title Skeleton */}
              <div className="skeleton-line mb-2 h-3 w-24 rounded"></div>

              {/* Date Skeleton */}
              <div className="skeleton-line h-3 w-20 rounded"></div>
            </div>

            <div className="flex items-center mt-4 md:mt-0">
              {/* Rating Skeleton */}
              <div className="skeleton-line mr-4 h-6 w-24 rounded"></div>

              {/* Button Skeleton */}
              <div className="skeleton-line h-8 w-16 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileCardSkeleton;
