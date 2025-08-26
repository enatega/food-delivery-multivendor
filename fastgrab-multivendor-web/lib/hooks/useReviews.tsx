import { useQuery } from "@apollo/client";
import {  GET_REVIEWS_BY_RESTAURANT } from "../api/graphql";

export default function useReviews(restaurant: string) {
  const { data, refetch, networkStatus, loading, error } = useQuery(
    GET_REVIEWS_BY_RESTAURANT,
    {
      variables: { restaurant },
      fetchPolicy: "network-only",
    }
  );
  return { data, refetch, networkStatus, loading, error };
}
