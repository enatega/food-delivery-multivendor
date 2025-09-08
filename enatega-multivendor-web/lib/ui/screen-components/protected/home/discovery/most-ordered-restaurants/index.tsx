"use client";
import SliderCard from "@/lib/ui/useable-components/slider-card";
// hook
import useMostOrderedRestaurants from "@/lib/hooks/useMostOrderedRestaurants";
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
import { useTranslations } from "next-intl";

function MostOrderedRestaurants() {
  const t = useTranslations();
  const { queryData, error, loading } = useMostOrderedRestaurants();

  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return;
  }
  return (
    <SliderCard
      heading="most_ordered_restaurants"
      data={queryData || []}
      title="most-ordered-restaurants"
    />
  );
}

export default MostOrderedRestaurants;
