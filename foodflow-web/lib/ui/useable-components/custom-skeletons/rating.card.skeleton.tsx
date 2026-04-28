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
            <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>

            <div className="flex-grow text-center md:text-left">
              {/* Name Skeleton */}
              <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>

              {/* Job Title Skeleton */}
              <div className="w-24 h-3 bg-gray-200 rounded mb-2"></div>

              {/* Date Skeleton */}
              <div className="w-20 h-3 bg-gray-200 rounded"></div>
            </div>

            <div className="flex items-center mt-4 md:mt-0">
              {/* Rating Skeleton */}
              <div className="w-24 h-6 bg-gray-200 rounded mr-4"></div>

              {/* Button Skeleton */}
              <div className="w-16 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileCardSkeleton;
