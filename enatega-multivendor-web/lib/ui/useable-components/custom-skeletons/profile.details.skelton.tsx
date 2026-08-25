
export default function ProfileDetailsSkeleton() {
    return (
        <div className="skeleton-ring w-full animate-pulse rounded-lg border bg-dispatch-surface p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar Skeleton */}
            <div className="skeleton-surface h-16 w-16 rounded-full"></div>
            
            {/* Name Skeleton */}
            <div className="skeleton-line h-6 w-40 rounded"></div>
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="skeleton-line mb-2 h-4 w-24 rounded"></div>
              <div className="skeleton-line h-5 w-full rounded"></div>
            </div>
            <div>
              <div className="skeleton-line mb-2 h-4 w-24 rounded"></div>
              <div className="skeleton-line h-5 w-full rounded"></div>
            </div>
          </div>
        </div>
      );
  }
  
