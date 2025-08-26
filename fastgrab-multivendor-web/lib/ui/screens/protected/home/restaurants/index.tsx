"use client";

import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
import useGetCuisines from "@/lib/hooks/useGetCuisines";
import GenericListingComponent from "@/lib/ui/screen-components/protected/home/GenericListingComponent";
import { useTranslations } from "next-intl";

export default function RestaurantsScreen() {
  const t = useTranslations()
  const { loading, error, restaurantsData } = useNearByRestaurantsPreview();
  const { restaurantCuisinesData } = useGetCuisines();

  return (
    <GenericListingComponent
      headingTitle={t('RestaurantPage.headingTitle')}
      cuisineSectionTitle={t('RestaurantPage.cuisineSectionTitle')}
      mainSectionTitle={t('RestaurantPage.mainSectionTitle')}
      mainData={restaurantsData}
      cuisineDataFromHook={restaurantCuisinesData}
      loading={loading}
      error={!!error}
    />
  );
}
