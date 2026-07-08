"use client"
import CuisinesSliderCard from "@/lib/ui/useable-components/cuisines-slider-card";
// loading skeleton
import CuisinesSliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/cuisines.slider.skeleton";

// Grocery subset from the single mostOrderedRestaurants fetch in DiscoveryScreen.
function PopularStores({ data, loading, error }: { data?: any[]; loading?: boolean; error?: boolean }) {
  if (loading) {
    return <CuisinesSliderSkeleton />;
  }

  if (error) {
    return;
  }

  return (
    <CuisinesSliderCard
      title="Popular-stores"
      data={data || []}
      showLogo={true}
      last={true}
      cuisines={false}
    />
  );
}

export default PopularStores;
