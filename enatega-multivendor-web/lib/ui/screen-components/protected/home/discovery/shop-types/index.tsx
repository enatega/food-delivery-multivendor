"use client";
import CuisinesSliderCard from "@/lib/ui/useable-components/cuisines-slider-card";
// hook
// loading skeleton
import CuisinesSliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/cuisines.slider.skeleton";
import { useQuery } from "@apollo/client";
import { FETCH_ALL_SHOP_TYPES } from "@/lib/api/graphql/queries/shop-type";

function ShopTypes() {
  // const { error, loading, queryData } = useMostOrderedRestaurants(true,1,8,"restaurant");
  const { data, loading, error } = useQuery(FETCH_ALL_SHOP_TYPES);

  // console.log({ PopularRestaurants: queryData });

  if (loading) {
    return <CuisinesSliderSkeleton />;
  }

  if (error) {
    return;
  }

  return (
    <CuisinesSliderCard
      title="shop-types"
      data={data?.fetchAllShopTypes?.data || []}
      showLogo={false}
      cuisines={false}
      shopTypes={true}
    />
    // <div>Shop types</div>
  );
}

export default ShopTypes;
