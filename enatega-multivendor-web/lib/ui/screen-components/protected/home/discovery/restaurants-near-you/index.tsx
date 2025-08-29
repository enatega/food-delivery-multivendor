"use client"
import SliderCard from "@/lib/ui/useable-components/slider-card";
// Hook
import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
import { useTranslations } from "next-intl";

function RestaurantsNearYou() {
  const t = useTranslations();

  const { queryData, error, loading } = useNearByRestaurantsPreview();

  if (loading) {
    return <SliderSkeleton/>;
  }

  if (error) {
    return;
  }
  return (
    <SliderCard
      title={t("DiscoveryPage.storenearyou")}
      data={queryData || []}
    />
  );
}

export default RestaurantsNearYou;
