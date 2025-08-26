import CustomRestaurantCardSkeleton from "@/lib/ui/useable-components/custom-skeletons/restaurant.card.skeleton";

interface ISkeletonGridProps {
  count?: number;
}

const CardSkeletonGrid: React.FC<ISkeletonGridProps> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="w-full">
          <CustomRestaurantCardSkeleton />
        </div>
      ))}
    </div>
  );
};

export default CardSkeletonGrid;
