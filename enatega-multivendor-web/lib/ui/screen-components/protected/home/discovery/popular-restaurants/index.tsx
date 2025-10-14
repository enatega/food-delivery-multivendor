"use client"
import CuisinesSliderCard from "@/lib/ui/useable-components/cuisines-slider-card";
// hook
import useMostOrderedRestaurants from "@/lib/hooks/useMostOrderedRestaurants";
// loading skeleton
import CuisinesSliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/cuisines.slider.skeleton";

function PopularRestaurants() {
  const { error, loading, queryData } = useMostOrderedRestaurants(true,1,8,"restaurant");

  console.log({PopularRestaurants:queryData})

  if (loading) {
    return <CuisinesSliderSkeleton />;
  }

  if (error) {
    return;
  }
  

  return (
    <CuisinesSliderCard
      title="Popular-restaurants"
      data={queryData || []}
      showLogo={true}
      cuisines={false}
    />
  );
}

export default PopularRestaurants;
