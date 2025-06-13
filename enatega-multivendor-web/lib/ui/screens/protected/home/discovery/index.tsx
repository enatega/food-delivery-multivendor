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
} from "@/lib/ui/screen-components/protected/home";
// ui componnet
import CuisinesSection from "@/lib/ui/useable-components/cuisines-section";
// hooks
import useGetCuisines from "@/lib/hooks/useGetCuisines";

export default function DiscoveryScreen() {
  const { restaurantCuisinesData, groceryCuisinesData, error, loading } =
    useGetCuisines();
  return (
    <>
      <DiscoveryBannerSection />
      <OrderItAgain />
      <MostOrderedRestaurants />
      <CuisinesSection
        title={"Restaurant cuisines"}
        data={restaurantCuisinesData}
        loading={loading}
        error={!!error}
      />
      <RestaurantsNearYou />
      <CuisinesSection
        title={"Grocery cuisines"}
        data={groceryCuisinesData}
        loading={loading}
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
