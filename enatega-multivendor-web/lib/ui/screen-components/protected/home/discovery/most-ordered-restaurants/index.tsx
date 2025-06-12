import SliderCard from "@/lib/ui/useable-components/slider-card";
// hook
import useMostOrderedRestaurants from "@/lib/hooks/useMostOrderedRestaurants";
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";

function MostOrderedRestaurants() {
  const { queryData, error, loading } = useMostOrderedRestaurants()

  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return;
  }
  return (
    <SliderCard
      title="Most ordered restaurants"
      data={queryData || []}
    />
  );
}

export default MostOrderedRestaurants;
