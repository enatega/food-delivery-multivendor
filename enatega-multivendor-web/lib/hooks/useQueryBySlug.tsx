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
  if (!slug) return { data: [], loading: false, error: undefined };

  switch (slug) {
    /**
     * 🔹 Most ordered (all shop types)
     */
    case "most-ordered-restaurants": {
      const mostOrdered = useMostOrderedRestaurants(true, page, limit, null); // null → no filter
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
      const mostOrdered = useMostOrderedRestaurants(
        true,
        page,
        limit,
        "grocery"
      );
      const data = mostOrdered.queryData;
      return {
        data: Array.isArray(data) ? data : [],
        loading: mostOrdered.loading,
        error: mostOrdered.error,
        fetchMore: async (vars) => {
          const res = await mostOrdered.fetchMore({
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
      const mostOrdered = useMostOrderedRestaurants(
        true,
        page,
        limit,
        "restaurant"
      );
      const data = mostOrdered.queryData;
      return {
        data: Array.isArray(data) ? data : [],
        loading: mostOrdered.loading,
        error: mostOrdered.error,
        fetchMore: async (vars) => {
          const res = await mostOrdered.fetchMore({
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
      const mostOrdered = useMostOrderedRestaurants(
        true,
        page,
        limit,
        "grocery"
      );
      const data = mostOrdered.queryData;
      return {
        data: Array.isArray(data) ? data : [],
        loading: mostOrdered.loading,
        error: mostOrdered.error,
        fetchMore: async (vars) => {
          const res = await mostOrdered.fetchMore({
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
      const nearby = useNearByRestaurantsPreview(true, page, limit);
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
      const nearby = useNearByRestaurantsPreview(true, page, limit, "grocery");
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

    /**
     * 🔹 Order it again
     */
    case "order-it-again": {
      const recentOrdered = useRecentOrderRestaurants(true);
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
      const ourBrands = useTopRatedVendors(true);
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
