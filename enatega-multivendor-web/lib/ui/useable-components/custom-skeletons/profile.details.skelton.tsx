
export default function ProfileDetailsSkeleton() {
    return (
        <div className="p-6 w-full bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar Skeleton */}
            <div className="h-16 w-16 bg-gray-300 rounded-full"></div>
            
            {/* Name Skeleton */}
            <div className="h-6 w-40 bg-gray-300 rounded"></div>
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-5 w-full bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-5 w-full bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      );
  }
  