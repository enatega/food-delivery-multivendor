import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
import useGetCuisines from "@/lib/hooks/useGetCuisines";
import GenericListingComponent from "@/lib/ui/screen-components/protected/home/GenericListingComponent";

export default function StoreScreen() {
  const { loading, error, groceriesData } = useNearByRestaurantsPreview();
  const { groceryCuisinesData } = useGetCuisines();

  return ( 
    <GenericListingComponent
      headingTitle="Stores and groceries near you"
      cuisineSectionTitle="Browse categories"
      mainSectionTitle="All Stores"
      mainData={groceriesData}
      cuisineDataFromHook={groceryCuisinesData}
      loading={loading}
      error={!!error}
    />
  );
}
