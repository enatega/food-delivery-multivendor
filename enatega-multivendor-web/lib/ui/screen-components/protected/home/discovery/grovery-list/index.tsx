"use client"
import SliderCard from "@/lib/ui/useable-components/slider-card";
// Hook
import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
import { useTranslations } from "next-intl";

function GroceryList() {
  const t = useTranslations()
  const { error, loading, groceriesData } = useNearByRestaurantsPreview();

  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return;
  }

  return <SliderCard title={t('DiscoveryPage.grocerylist')} data={groceriesData || []} />;
}

export default GroceryList;
