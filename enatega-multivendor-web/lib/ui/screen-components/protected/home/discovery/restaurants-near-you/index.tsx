"use client"
import SliderCard from "@/lib/ui/useable-components/slider-card";
// Hook
import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
import { useTranslations } from "next-intl";

function RestaurantsNearYou({data,loading,error}) {
  const t = useTranslations();

  // const { queryData, error, loading } = useNearByRestaurantsPreview(true,1,6);

  if (loading) {
    return <SliderSkeleton/>;
  }

  if (error) {
    return;
  }
  return (
    <SliderCard
    heading={t("generic_listing_heading")}
    title={"restaurants-near-you"}
      data={data || []}
    />
  );
}

export default RestaurantsNearYou;
