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

const useNearByRestaurantsPreview = (enabled = true , page = 1, limit= 10) => {
  const { userAddress } = useUserAddress();
  const userLongitude = Number(userAddress?.location?.coordinates[0]) || 0
  const userLatitude = Number(userAddress?.location?.coordinates[1]) || 0

  const { data, loading, error, networkStatus, fetchMore } =
    useQuery<INearByRestaurantsPreviewData>(NEAR_BY_RESTAURANTS_PREVIEW, {
      variables: {
        latitude: userLatitude,
        longitude: userLongitude,
        shopType: null,
        page,
        limit,
      },
      fetchPolicy: "cache-and-network",
      skip: !enabled,
      notifyOnNetworkStatusChange: true, // 🔑 helps track loading state when fetching more
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
    fetchMore, // 🔑 expose fetchMore for infinite scroll
  };
};

export default useNearByRestaurantsPreview;
