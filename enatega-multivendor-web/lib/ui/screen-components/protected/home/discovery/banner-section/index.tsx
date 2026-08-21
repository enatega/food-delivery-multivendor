// query
import { GET_BANNERS } from "@/lib/api/graphql/queries";
// gql
import { type DocumentNode, useQuery } from "@apollo/client";
// loading skeleton
import DiscoveryBannerSkeleton from "@/lib/ui/useable-components/custom-skeletons/banner.skeleton";
// Interface
import { IGetBannersResponse } from "@/lib/utils/interfaces";
// banner card
import OrbitBannerCarousel from "./banner-card";
import { useAppMode } from "@/lib/mode";

export default function DiscoveryBannerSection({
  query = GET_BANNERS,
  banners,
  loading: suppliedLoading,
  error: suppliedError,
}: {
  query?: DocumentNode;
  banners?: IGetBannersResponse["banners"];
  loading?: boolean;
  error?: unknown;
}) {
  const { isSingleVendor } = useAppMode();
  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery<IGetBannersResponse>(query, {
    fetchPolicy: "cache-and-network",
    skip: banners !== undefined,
  });
  const loading = suppliedLoading ?? queryLoading;
  const error = suppliedError ?? queryError;
  const bannerItems = banners ?? data?.banners;

  if (loading) {
    return <DiscoveryBannerSkeleton single={isSingleVendor} />;
  }
  if (error) {
    return null;
  }

  if (!bannerItems?.length) return null;

  return <OrbitBannerCarousel items={bannerItems} />;
}
