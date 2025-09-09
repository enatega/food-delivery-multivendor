"use client";
import {
  DiscoveryBannerSection,
  RestaurantsNearYou,
  MostOrderedRestaurants,
  GroceryList,
  TopGroceryPicks,
  TopRatedVendors,
  PopularRestaurants,
  PopularStores,
  OrderItAgain,
  CommingSoonScreen,
} from "@/lib/ui/screen-components/protected/home";
// ui componnet
import CuisinesSection from "@/lib/ui/useable-components/cuisines-section";
// hooks
import useGetCuisines from "@/lib/hooks/useGetCuisines";
import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";

export default function DiscoveryScreen() {
  const { restaurantCuisinesData, groceryCuisinesData, error, loading } =
    useGetCuisines();

  const {
    loading: restaurantsLoading,
    restaurantsData,
    groceriesData,
  } = useNearByRestaurantsPreview();

  // Show loader/skeleton while fetching
  if (loading && restaurantsLoading) {
    return (
      <>
        <DiscoveryBannerSection />
        <OrderItAgain />
        <MostOrderedRestaurants />
        <CuisinesSection
          title="Restaurant-cuisines"
          data={restaurantCuisinesData}
          loading={loading || restaurantsLoading}
          error={!!error}
        />
        <RestaurantsNearYou />
        <CuisinesSection
          title="Grocery-cuisines"
          data={groceryCuisinesData}
          loading={loading || restaurantsLoading}
          error={!!error}
        />
        <GroceryList />
        <TopGroceryPicks />
        <TopRatedVendors />
        <PopularRestaurants />
        <PopularStores />
      </>
    );
  }

  // // Show ComingSoon only after loading is complete and data is confirmed empty
  if (
    restaurantsData.length === 0 &&
    groceriesData.length === 0 &&
    !loading &&
    !restaurantsLoading
  ) {
    return <CommingSoonScreen />;
  }

  return (
    <>
        <DiscoveryBannerSection />
        <OrderItAgain />
        <MostOrderedRestaurants />
        <CuisinesSection
          title="Restaurant-cuisines"
          data={restaurantCuisinesData}
          loading={loading || restaurantsLoading}
          error={!!error}
        />
        <RestaurantsNearYou />
        <CuisinesSection
          title="Grocery-cuisines"
          data={groceryCuisinesData}
          loading={loading || restaurantsLoading}
          error={!!error}
        />
        <GroceryList />
        <TopGroceryPicks />
        <TopRatedVendors />
        <PopularRestaurants />
        <PopularStores />
      </>
  );
}
