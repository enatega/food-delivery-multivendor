import useMostOrderedRestaurants from "./useMostOrderedRestaurants";
import useNearByRestaurantsPreview from "./useNearByRestaurantsPreview";
import useRecentOrderRestaurants from "./useRecentOrderRestaurants";
import useTopRatedVendors from "./useTopRatedVendors";

import { IRestaurant } from "../utils/interfaces/restaurants.interface";
import { ApolloError } from "@apollo/client";
import { ICuisinesData } from "../utils/interfaces";

interface UseQueryBySlugResult {
  data?: IRestaurant[] | ICuisinesData[];
  loading: boolean;
  error?: ApolloError;
  fetchMore?: (vars?: any) => Promise<IRestaurant[]>;
}

export default function useQueryBySlug(
  slug: string,
  page: number = 1,
  limit: number
): UseQueryBySlugResult {
  const mostOrdered = useMostOrderedRestaurants(true, page, limit, null); // null → no filter
  const grocery_pick = useMostOrderedRestaurants(true, page, limit, "grocery");
  const popular_restaurant = useMostOrderedRestaurants(
    true,
    page,
    limit,
    "restaurant"
  );
  const popular_stores = useMostOrderedRestaurants(
    true,
    page,
    limit,
    "grocery"
  );
  const nearby = useNearByRestaurantsPreview(true, page, limit);
  const grocery_list = useNearByRestaurantsPreview(
    true,
    page,
    limit,
    "grocery"
  );
  const recentOrdered = useRecentOrderRestaurants(true);
  const ourBrands = useTopRatedVendors(true);
  if (!slug) return { data: [], loading: false, error: undefined };
  switch (slug) {
    /**
     * 🔹 Most ordered (all shop types)
     */
    case "most-ordered-restaurants": {
      const data = mostOrdered.queryData;
      return {
        data: Array.isArray(data) ? data : [],
        loading: mostOrdered.loading,
        error: mostOrdered.error,
        fetchMore: async (vars) => {
          const res = await mostOrdered.fetchMore({
            variables: { ...vars, shopType: null },
          });
          return res?.data?.mostOrderedRestaurantsPreview ?? [];
        },
      };
    }

    /**
     * 🔹 Top grocery picks
     */
    case "top-grocery-picks": {
      const data = grocery_pick.queryData;
      return {
        data: Array.isArray(data) ? data : [],
        loading: grocery_pick.loading,
        error: grocery_pick.error,
        fetchMore: async (vars) => {
          const res = await grocery_pick.fetchMore({
            variables: { ...vars, shopType: "grocery" },
          });
          return res?.data?.mostOrderedRestaurantsPreview ?? [];
        },
      };
    }

    /**
     * 🔹 Popular restaurants
     */
    case "popular-restaurants": {
      const data = popular_restaurant.queryData;
      return {
        data: Array.isArray(data) ? data : [],
        loading: popular_restaurant.loading,
        error: popular_restaurant.error,
        fetchMore: async (vars) => {
          const res = await popular_restaurant.fetchMore({
            variables: { ...vars, shopType: "restaurant" },
          });
          return res?.data?.mostOrderedRestaurantsPreview ?? [];
        },
      };
    }

    /**
     * 🔹 Popular stores (alias for grocery)
     */
    case "popular-stores": {
      const data = popular_stores.queryData;
      return {
        data: Array.isArray(data) ? data : [],
        loading: popular_stores.loading,
        error: popular_stores.error,
        fetchMore: async (vars) => {
          const res = await popular_stores.fetchMore({
            variables: { ...vars, shopType: "grocery" },
          });
          return res?.data?.mostOrderedRestaurantsPreview ?? [];
        },
      };
    }

    /**
     * 🔹 Nearby
     */
    case "restaurants-near-you": {
      const data = nearby.queryData;
      return {
        data: Array.isArray(data) ? data : [],
        loading: nearby.loading,
        error: nearby.error,
        fetchMore: async (vars) => {
          const res = await nearby.fetchMore(vars);
          return res?.data?.nearByRestaurantsPreview?.restaurants ?? [];
        },
      };
    }
    case "grocery-list": {
      const data = grocery_list.queryData;
      return {
        data: Array.isArray(data) ? data : [],
        loading: grocery_list.loading,
        error: grocery_list.error,
        fetchMore: async (vars) => {
          const res = await grocery_list.fetchMore(vars);
          return res?.data?.nearByRestaurantsPreview?.restaurants ?? [];
        },
      };
    }

    /**
     * 🔹 Order it again
     */
    case "order-it-again": {
      const data = recentOrdered.queryData;
      return {
        data: Array.isArray(data) ? data : [],
        loading: recentOrdered.loading,
        error: recentOrdered.error,
      };
    }

    /**
     * 🔹 Our brands
     */
    case "our-brands": {
      const data = ourBrands.queryData;
      return {
        data: Array.isArray(data) ? data : [],
        loading: ourBrands.loading,
        error: ourBrands.error,
      };
    }

    default:
      return { data: [], loading: false, error: undefined };
  }
}
