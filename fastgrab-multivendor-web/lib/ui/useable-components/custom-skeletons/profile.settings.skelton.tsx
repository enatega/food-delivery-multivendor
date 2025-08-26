const ProfileSettingsSkeleton = () => {
    return (
      <div className="w-full mx-auto bg-white animate-pulse">
        {/* Skeleton Loader */}
        {[...Array(6)].map((_, index) => (
          <div key={index} className="py-4 border-b">
            <div className="flex justify-between items-center gap-4">
              <div className="bg-gray-300 h-6 w-full rounded"></div>
              <div className="bg-gray-300 h-6 w-24 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ProfileSettingsSkeleton;
  