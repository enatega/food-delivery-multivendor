import useMostOrderedRestaurants from "./useMostOrderedRestaurants";
import useNearByRestaurantsPreview from "./useNearByRestaurantsPreview";
import useRecentOrderRestaurants from "./useRecentOrderRestaurants";
// import useGetCuisines from "./useGetCuisines";
import { IRestaurant } from "../utils/interfaces/restaurants.interface";
import { ApolloError } from "@apollo/client";
import { ICuisinesData } from "../utils/interfaces";
import useTopRatedVendors from "./useTopRatedVendors";

const SLUG_TO_DATA_KEY_MAP: Record<string, { type: 'mostOrdered' | 'nearby' | 'recent' | 'cuisines' | 'ourBrands' , key: 'queryData' | 'groceriesData' | 'restaurantsData' | 'restaurantCuisinesData' |  'groceryCuisinesData'}> = {
  "most-ordered-restaurants": { type: 'mostOrdered', key: 'queryData' },
  "top-grocery-picks": { type: 'mostOrdered', key: 'groceriesData' },
  "popular-restaurants": { type: 'mostOrdered', key: 'restaurantsData' },
  "popular-stores": { type: 'mostOrdered', key: 'groceriesData' },
  "restaurants-near-you": { type: 'nearby', key: 'queryData' },
  "grocery-list": { type: 'nearby', key: 'groceriesData' },
  "order-it-again": { type: 'recent', key: 'queryData' },
  // 'restaurant-cuisines': {type: 'cuisines', key: 'restaurantCuisinesData'},
  // 'grocery-cuisines': { type: 'cuisines', key: 'groceryCuisinesData' },
  'our-brands': { type: 'ourBrands', key: 'queryData' }
};

interface UseQueryBySlugResult {
  data?: IRestaurant[] | ICuisinesData[];
  loading: boolean;
  error?: ApolloError;
}

export default function useQueryBySlug(slug: string):UseQueryBySlugResult {
  const config = SLUG_TO_DATA_KEY_MAP[slug];

  const mostOrdered = useMostOrderedRestaurants(!!config && config.type === 'mostOrdered');
  const nearby = useNearByRestaurantsPreview(!!config && config.type === 'nearby');
  const recentOrdered = useRecentOrderRestaurants(!!config && config.type === 'recent');
  // const cuisines = useGetCuisines(!!config && config.type === 'cuisines')
  const ourBrands = useTopRatedVendors(!!config && config.type === 'ourBrands')

  if (!config) {
    return {
      data: [],
      loading: false,
      error: undefined,
    };
  }
  const { type, key } = config;

  if (type === "mostOrdered") {
    const data = mostOrdered[key as keyof typeof mostOrdered];
    return {
      data: Array.isArray(data) ? (data as IRestaurant[]) : [],
      loading: mostOrdered.loading,
      error: mostOrdered.error,
    };
  }
  
  if (type === "nearby") {
    const data = nearby[key as keyof typeof nearby];
    return {
      data: Array.isArray(data) ? (data as IRestaurant[]) : [],
      loading: nearby.loading,
      error: nearby.error,
    };
  }
  
  if (type === "recent") {
    const data = recentOrdered.queryData;
    return {
      data: Array.isArray(data) ? data : [],
      loading: recentOrdered.loading,
      error: recentOrdered.error,
    };
  }

  // if (type === "cuisines") {
  //   const data = cuisines[key as keyof typeof cuisines];
  //   return {
  //     data: Array.isArray(data) ? (data as ICuisinesData[]) : [],
  //     loading: cuisines.loading,
  //     error: cuisines.error,
  //   };
  // }

  if (type === "ourBrands") {
    const data = ourBrands.queryData;
    return {
      data: Array.isArray(data) ? data : [],
      loading: ourBrands.loading,
      error: ourBrands.error,
    };
  }

  return {
    data: [],
    loading: false,
    error: undefined,
  };
  

}
