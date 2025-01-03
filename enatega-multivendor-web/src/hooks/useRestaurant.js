import { gql, useQuery } from "@apollo/client";
import { restaurant } from "../apollo/server";

const RESTAURANT = gql`
  ${restaurant}
`;

export default function useRestaurant(id, slug) {
  const { data, refetch, networkStatus, loading, error } = useQuery(RESTAURANT, {
    variables: { id, slug },
    fetchPolicy: "network-only",
  });
  return { data, refetch, networkStatus, loading, error };
}
