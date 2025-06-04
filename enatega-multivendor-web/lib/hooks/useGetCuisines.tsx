// Queries
import {
  // GET_CUISINES,
  NEAR_BY_RESTAURANTS_CUISINES,
} from "../api/graphql/queries";
// useQuery
import { useQuery } from "@apollo/client";
// interfaces
import { ICuisinesResponse, ICuisinesData } from "@/lib/utils/interfaces";
// context
import { useUserAddress } from "../context/address/address.context";

const useGetCuisines = (enabled = true) => {
  const { userAddress } = useUserAddress();
  const userLongitude = userAddress?.location?.coordinates[0] || 0
  const userLatitude = userAddress?.location?.coordinates[1] || 0

  const { data, loading, error, networkStatus } = useQuery<ICuisinesResponse>(
    NEAR_BY_RESTAURANTS_CUISINES,
    {
      variables: {
        latitude: userLatitude,
        longitude: userLongitude,
        shopType: null,
      },
      fetchPolicy: "cache-and-network",
      skip: !enabled,
    }
  );

  let queryData = data?.nearByRestaurantsCuisines;

  let restaurantCuisinesData: ICuisinesData[] = Array.isArray(
    data?.nearByRestaurantsCuisines
  )
    ? data.nearByRestaurantsCuisines.filter(
        (item) => item.shopType.toLowerCase() === "restaurant"
      )
    : [];

  let groceryCuisinesData: ICuisinesData[] = Array.isArray(
    data?.nearByRestaurantsCuisines
  )
    ? data.nearByRestaurantsCuisines.filter(
        (item) => item.shopType.toLowerCase() === "grocery"
      )
    : [];

  return {
    queryData,
    loading,
    error,
    networkStatus,
    restaurantCuisinesData,
    groceryCuisinesData,
  };
};

export default useGetCuisines;
