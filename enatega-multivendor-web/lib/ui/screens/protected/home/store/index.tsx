"use client"

import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
import useGetCuisines from "@/lib/hooks/useGetCuisines";
import GenericListingComponent from "@/lib/ui/screen-components/protected/home/GenericListingComponent";
import { useTranslations } from "next-intl";

export default function StoreScreen() {
  const t = useTranslations();
  const { loading, error, groceriesData } = useNearByRestaurantsPreview();
  const { groceryCuisinesData } = useGetCuisines();

  return ( 
    <GenericListingComponent
      headingTitle= {t('StoresPage.headingTitle')}
      cuisineSectionTitle={t('StoresPage.cuisineSectionTitle')}
      mainSectionTitle={t('StoresPage.mainSectionTitle')}
      mainData={groceriesData}
      cuisineDataFromHook={groceryCuisinesData}
      loading={loading}
      error={!!error}
    />
  );
}
