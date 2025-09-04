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
import { useTranslations } from "next-intl";

export default function DiscoveryScreen() {
  const t = useTranslations();
  const { restaurantCuisinesData, groceryCuisinesData, error, loading } =
    useGetCuisines();

  // Show loader/skeleton while fetching
  if (loading) {
    return (
      <>
        <DiscoveryBannerSection />
        <OrderItAgain />
        <MostOrderedRestaurants />
        <CuisinesSection
          title={t("DiscoveryPage.restaurantcusines")}
          data={restaurantCuisinesData}
          loading={loading}
          error={!!error}
        />
        <RestaurantsNearYou />
        <CuisinesSection
          title={t("DiscoveryPage.GroceryStores")}
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

  // Show ComingSoon only after loading is complete and data is confirmed empty
  if (restaurantCuisinesData && restaurantCuisinesData.length === 0) {
    return <CommingSoonScreen />;
  }

  return (
    <>
      <DiscoveryBannerSection />
      <OrderItAgain />
      <MostOrderedRestaurants />
      <CuisinesSection
        title={t("DiscoveryPage.restaurantcusines")}
        data={restaurantCuisinesData}
        loading={loading}
        error={!!error}
      />
      <RestaurantsNearYou />
      <CuisinesSection
        title={t("DiscoveryPage.GroceryStores")}
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
