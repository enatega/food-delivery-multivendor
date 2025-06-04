"use client";

import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
import useGetCuisines from "@/lib/hooks/useGetCuisines";
import GenericListingComponent from "@/lib/ui/screen-components/protected/home/GenericListingComponent";

export default function RestaurantsScreen() {
  const { loading, error, restaurantsData } = useNearByRestaurantsPreview();
  const { restaurantCuisinesData } = useGetCuisines();

  return (
    <GenericListingComponent
      headingTitle="Restaurants near you"
      cuisineSectionTitle="Browse categories"
      mainSectionTitle="All Restaurants"
      mainData={restaurantsData}
      cuisineDataFromHook={restaurantCuisinesData}
      loading={loading}
      error={!!error}
    />
  );
}
