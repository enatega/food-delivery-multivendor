// Queries
import { MOST_ORDER_RESTAURANTS } from "@/lib/api/graphql/queries";
// UseQuery
import { useQuery } from "@apollo/client";
// interfaces
import {
  IMostOrderedRestaurantsData,
  IRestaurant,
} from "../utils/interfaces/restaurants.interface";
// context
import { useUserAddress } from "../context/address/address.context";

const useMostOrderedRestaurants = (enabled = true) => {
  const { userAddress } = useUserAddress();
  const userLongitude = userAddress?.location?.coordinates[0] || 0
  const userLatitude = userAddress?.location?.coordinates[1] || 0

  const { data, loading, error, networkStatus } =
    useQuery<IMostOrderedRestaurantsData>(MOST_ORDER_RESTAURANTS, {
      variables: {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      fetchPolicy: "cache-and-network",
      skip: !enabled,
    });

  let queryData = data?.mostOrderedRestaurantsPreview;

  let restaurantsData: IRestaurant[] =
    queryData?.filter(
      (item) => item?.shopType.toLowerCase() === "restaurant"
    ) || [];

  let groceriesData: IRestaurant[] =
    queryData?.filter((item) => item?.shopType.toLowerCase() === "grocery") ||
    [];

  return {
    queryData,
    loading,
    error,
    networkStatus,
    restaurantsData,
    groceriesData,
  };
};

export default useMostOrderedRestaurants;
