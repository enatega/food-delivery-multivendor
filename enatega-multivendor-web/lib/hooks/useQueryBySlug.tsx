import useMostOrderedRestaurants from "./useMostOrderedRestaurants";
import useNearByRestaurantsPreview from "./useNearByRestaurantsPreview";
import useRecentOrderRestaurants from "./useRecentOrderRestaurants";
import useTopRatedVendors from "./useTopRatedVendors";

// interfaces
import { IRestaurant } from "../utils/interfaces/restaurants.interface";
import { ApolloError } from "@apollo/client";
import { ICuisinesData } from "../utils/interfaces";

const SLUG_TO_DATA_KEY_MAP: Record<
  string,
  {
    type: "mostOrdered" | "nearby" | "recent" | "cuisines" | "ourBrands";
    key:
      | "queryData"
      | "groceriesData"
      | "restaurantsData"
      | "restaurantCuisinesData"
      | "groceryCuisinesData";
  }
> = {
  "most-ordered-restaurants": { type: "mostOrdered", key: "queryData" },
  "top-grocery-picks": { type: "mostOrdered", key: "groceriesData" },
  "popular-restaurants": { type: "mostOrdered", key: "restaurantsData" },
  "popular-stores": { type: "mostOrdered", key: "groceriesData" },
  "restaurants-near-you": { type: "nearby", key: "queryData" },
  "grocery-list": { type: "nearby", key: "groceriesData" },
  "order-it-again": { type: "recent", key: "queryData" },
  "our-brands": { type: "ourBrands", key: "queryData" },
};

interface UseQueryBySlugResult {
  data?: IRestaurant[] | ICuisinesData[];
  loading: boolean;
  error?: ApolloError;
  fetchMore?: (vars?: any) => Promise<IRestaurant[]>; // 🔑 normalized return: always array
}

export default function useQueryBySlug(
  slug: string,
  page: number = 1,
  limit: number
): UseQueryBySlugResult {
  const config = SLUG_TO_DATA_KEY_MAP[slug];

  const mostOrdered =
    !!config && config.type === "mostOrdered"
      ? useMostOrderedRestaurants(true, page, limit)
      : undefined;

  const nearby =
    !!config && config.type === "nearby"
      ? useNearByRestaurantsPreview(true, page, limit)
      : undefined;

  const recentOrdered = useRecentOrderRestaurants(
    !!config && config.type === "recent"
  );

  const ourBrands = useTopRatedVendors(!!config && config.type === "ourBrands");

  if (!config) {
    return { data: [], loading: false, error: undefined };
  }

  const { type, key } = config;

  // --- MOST ORDERED ---
  if (type === "mostOrdered" && mostOrdered) {
    const data = mostOrdered[key as keyof typeof mostOrdered];

    const wrappedFetchMore = async (vars?: any): Promise<IRestaurant[]> => {
      const res = await mostOrdered.fetchMore?.(vars);
      return res?.data?.mostOrderedRestaurantsPreview ?? [];
    };

    return {
      data: Array.isArray(data) ? (data as IRestaurant[]) : [],
      loading: mostOrdered.loading,
      error: mostOrdered.error,
      fetchMore: wrappedFetchMore,
    };
  }

  // --- NEARBY ---
  if (type === "nearby" && nearby) {
    const data = nearby[key as keyof typeof nearby];

    const wrappedFetchMore = async (vars?: any): Promise<IRestaurant[]> => {
      const res = await nearby.fetchMore?.(vars);
      return res?.data?.nearByRestaurantsPreview?.restaurants ?? [];
    };

    return {
      data: Array.isArray(data) ? (data as IRestaurant[]) : [],
      loading: nearby.loading,
      error: nearby.error,
      fetchMore: wrappedFetchMore,
    };
  }

  // --- RECENT ---
  if (type === "recent") {
    const data = recentOrdered.queryData;
    return {
      data: Array.isArray(data) ? data : [],
      loading: recentOrdered.loading,
      error: recentOrdered.error,
    };
  }

  // --- OUR BRANDS ---
  if (type === "ourBrands") {
    const data = ourBrands.queryData;
    return {
      data: Array.isArray(data) ? data : [],
      loading: ourBrands.loading,
      error: ourBrands.error,
    };
  }

  return { data: [], loading: false, error: undefined };
}
