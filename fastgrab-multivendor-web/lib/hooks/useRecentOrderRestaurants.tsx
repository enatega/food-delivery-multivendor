// useQuery
import { useQuery } from "@apollo/client";
// queries
import { RECENT_ORDER_RESTAURANTS } from "@/lib/api/graphql";
// interfaces
import {
  IRecentOrderedRestaurantsData,
  IRestaurant,
} from "@/lib/utils/interfaces";

function useRecentOrderRestaurants(enabled = true) {
  const { loading, data, error } = useQuery<IRecentOrderedRestaurantsData>(
    RECENT_ORDER_RESTAURANTS,
    {
      variables: {
        latitude: 33.5831583,
        longitude: 73.0810976,
      },
      fetchPolicy: "cache-and-network",
      skip: !enabled,
    }
  );

  const queryData: IRestaurant[] = data?.recentOrderRestaurantsPreview || [];

  return {
    queryData,
    loading,
    error,
  };
}

export default useRecentOrderRestaurants;
