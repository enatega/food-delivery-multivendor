import { useQuery } from "@apollo/client";
import { GET_RESTAURANT_BY_ID_SLUG } from "../api/graphql";

export default function useRestaurant(id: string, slug?: string) {
  const { data, refetch, networkStatus, loading, error } = useQuery(
    GET_RESTAURANT_BY_ID_SLUG,
    {
      variables: { id, slug },
      fetchPolicy: "network-only",
    }
  );
  return { data, refetch, networkStatus, loading, error };
}
