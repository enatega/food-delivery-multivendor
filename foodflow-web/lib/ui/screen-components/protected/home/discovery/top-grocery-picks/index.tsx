// slider card
"use client"

import SliderCard from "@/lib/ui/useable-components/slider-card";
// hook
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
import useMostOrderedRestaurants from "@/lib/hooks/useMostOrderedRestaurants";

function TopGroceryPicks() {

  const { error, loading, queryData } = useMostOrderedRestaurants(true, 1, 6,"grocery");

  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return;
  }

  return <SliderCard heading="toppicks" title="Top-grocery-picks" data={queryData || []} />;
}

export default TopGroceryPicks;
