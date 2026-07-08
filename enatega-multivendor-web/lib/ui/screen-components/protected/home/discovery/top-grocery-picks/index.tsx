// slider card
"use client"

import SliderCard from "@/lib/ui/useable-components/slider-card";
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";

// Grocery subset from the single mostOrderedRestaurants fetch in DiscoveryScreen.
function TopGroceryPicks({ data, loading, error }: { data?: any[]; loading?: boolean; error?: boolean }) {
  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return;
  }

  return <SliderCard heading="toppicks" title="Top-grocery-picks" data={data || []} />;
}

export default TopGroceryPicks;
