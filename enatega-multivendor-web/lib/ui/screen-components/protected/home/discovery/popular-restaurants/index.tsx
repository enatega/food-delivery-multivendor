"use client"
import CuisinesSliderCard from "@/lib/ui/useable-components/cuisines-slider-card";
// loading skeleton
import CuisinesSliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/cuisines.slider.skeleton";

// Data comes from the single mostOrderedRestaurants fetch in DiscoveryScreen
// (restaurant subset) — avoids a duplicate network call per section.
function PopularRestaurants({ data, loading, error }: { data?: any[]; loading?: boolean; error?: boolean }) {
  if (loading) {
    return <CuisinesSliderSkeleton />;
  }

  if (error) {
    return;
  }

  return (
    <CuisinesSliderCard
      title="Popular-restaurants"
      data={data || []}
      showLogo={true}
      cuisines={false}
    />
  );
}

export default PopularRestaurants;
