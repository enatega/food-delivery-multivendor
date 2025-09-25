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
  fetchMore?: (vars?: any) => Promise<IRestaurant[]>; // ✅ always return array
}

export default function useQueryBySlug(
  slug: string,
  page: number = 1,
  limit: number
): UseQueryBySlugResult {
  // ✅ Hooks must always be called — never conditionally
  const mostOrdered = useMostOrderedRestaurants(true, page, limit);
  const nearby = useNearByRestaurantsPreview(true, page, limit);
  const recentOrdered = useRecentOrderRestaurants(true);
  const ourBrands = useTopRatedVendors(true);

  // Default return if slug is invalid
  if (!slug) return { data: [], loading: false, error: undefined };

  // Decide mapping
  switch (slug) {
    case "most-ordered-restaurants":
    case "top-grocery-picks":
    case "popular-restaurants":
    case "popular-stores": {
      const data =
        mostOrdered.queryData ||
        mostOrdered.groceriesData ||
        mostOrdered.restaurantsData;

      return {
        data: Array.isArray(data) ? (data as IRestaurant[]) : [],
        loading: mostOrdered.loading,
        error: mostOrdered.error,
        fetchMore: async (vars) => {
          const res = await mostOrdered.fetchMore(vars);
          return res?.data?.mostOrderedRestaurantsPreview ?? [];
        },
      };
    }

    case "restaurants-near-you":
    case "grocery-list": {
      const data =
        nearby.queryData ||
        nearby.groceriesData ||
        nearby.restaurantsData;

      return {
        data: Array.isArray(data) ? (data as IRestaurant[]) : [],
        loading: nearby.loading,
        error: nearby.error,
        fetchMore: async (vars) => {
          const res = await nearby.fetchMore(vars);
          return res?.data?.nearByRestaurantsPreview?.restaurants ?? [];
        },
      };
    }

    case "order-it-again": {
      const data = recentOrdered.queryData;
      return {
        data: Array.isArray(data) ? data : [],
        loading: recentOrdered.loading,
        error: recentOrdered.error,
      };
    }

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
