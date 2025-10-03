"use client";
import SliderCard from "@/lib/ui/useable-components/slider-card";
// hook
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";

function MostOrderedRestaurants({ data, loading,error }) {
  // const { queryData, error, loading } = useMostOrderedRestaurants(true, 1, 6);

  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return;
  }
  return (
    <SliderCard
      heading="most_ordered_restaurants"
      data={data || []}
      title="most-ordered-restaurants"
    />
  );
}

export default MostOrderedRestaurants;
