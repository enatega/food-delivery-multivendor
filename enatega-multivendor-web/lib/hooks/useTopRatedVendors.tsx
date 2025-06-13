// Queries
import { TOP_RATED_VENDORS } from "@/lib/api/graphql";
// useQuery
import { useQuery } from "@apollo/client";
// interfaces
import { ITopRatedVendorData } from "@/lib/utils/interfaces";
// context
import { useLocationContext } from "../context/Location/Location.context";

function useTopRatedVendors(enabled = true) {
  const { location } = useLocationContext();
  const userLatitude = Number(location?.latitude || "0")
  const userLongitude = Number(location?.longitude || "0")

  const { loading, error, data } = useQuery<ITopRatedVendorData>(
    TOP_RATED_VENDORS,
    {
      variables: {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      fetchPolicy: "cache-and-network",
      skip: !enabled,
    }
  );
  let queryData = data?.topRatedVendorsPreview;
  return {
    queryData,
    error,
    loading,
  };
}
export default useTopRatedVendors;
