// Queries
import { NEAR_BY_RESTAURANTS_PREVIEW } from "@/lib/api/graphql/queries";
// UseQuery
import { useQuery } from "@apollo/client";
// interface
import {
  INearByRestaurantsPreviewData,
  IRestaurant,
} from "../utils/interfaces/restaurants.interface";
// context
import { useUserAddress } from "../context/address/address.context";

const useNearByRestaurantsPreview = (enabled = true) => {
  const { userAddress } = useUserAddress();
  const userLongitude = Number(userAddress?.location?.coordinates[0]) || 0
  const userLatitude = Number(userAddress?.location?.coordinates[1]) || 0

  const { data, loading, error, networkStatus } =
    useQuery<INearByRestaurantsPreviewData>(NEAR_BY_RESTAURANTS_PREVIEW, {
      variables: {
        latitude: userLatitude,
        longitude: userLongitude,
        shopType: null,
      },
      fetchPolicy: "cache-and-network",
      skip: !enabled
    });

  let queryData = data?.nearByRestaurantsPreview?.restaurants;

  let groceriesData: IRestaurant[] =
    queryData?.filter((item) => item.shopType.toLowerCase() === "grocery") ||
    [];

  let restaurantsData: IRestaurant[] =
    queryData?.filter((item) => item.shopType.toLowerCase() === "restaurant") ||
    [];

  return {
    queryData,
    loading,
    error,
    networkStatus,
    groceriesData,
    restaurantsData,
  };
};

export default useNearByRestaurantsPreview;
