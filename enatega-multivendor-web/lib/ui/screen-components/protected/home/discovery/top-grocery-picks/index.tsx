// slider card
import SliderCard from "@/lib/ui/useable-components/slider-card";
// hook
import useMostOrderedRestaurants from "@/lib/hooks/useMostOrderedRestaurants";
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";

function TopGroceryPicks() {
  const { error, loading, groceriesData } = useMostOrderedRestaurants();

  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return;
  }

  return <SliderCard title="Top grocery picks" data={groceriesData || []} />;
}

export default TopGroceryPicks;
