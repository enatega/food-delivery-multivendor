// slider card
"use client"

import SliderCard from "@/lib/ui/useable-components/slider-card";
// hook
import useMostOrderedRestaurants from "@/lib/hooks/useMostOrderedRestaurants";
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
import { useTranslations } from "next-intl";

function TopGroceryPicks() {
  const t = useTranslations();

  const { error, loading, groceriesData } = useMostOrderedRestaurants();

  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return;
  }

  return <SliderCard title={t('DiscoveryPage.toppicks')} data={groceriesData || []} />;
}

export default TopGroceryPicks;
