import { Carousel } from "primereact/carousel";
// query
import { GET_BANNERS } from "@/lib/api/graphql/queries";
// gql
import { type DocumentNode, useQuery } from "@apollo/client";
// loading skeleton
import DiscoveryBannerSkeleton from "@/lib/ui/useable-components/custom-skeletons/banner.skeleton";
// Interface
import { IGetBannersResponse } from "@/lib/utils/interfaces";
// banner card
import BannerCard from "./banner-card";
import { useEffect, useState } from "react";

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
  const { data, loading: queryLoading, error: queryError } = useQuery<IGetBannersResponse>(query, {
    fetchPolicy: "cache-and-network",
    skip: banners !== undefined,
  });
  const loading = suppliedLoading ?? queryLoading;
  const error = suppliedError ?? queryError;
  const bannerItems = banners ?? data?.banners;

  // Check if RTL (client-side only)
  const [isRTL, setIsRTL] = useState(false);
  useEffect(() => {
    setIsRTL(document.documentElement.dir === "rtl");
  }, []);

  if (loading) {
    return <DiscoveryBannerSkeleton />;
  }
  if (error) {
    return null;
  }

  if (!bannerItems?.length) return null;

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="mt-10 sm:mt-0">
      <Carousel
        className={`discovery-carousel ${isRTL ? "rtl-carousel" : ""}`} // Add RTL class
        value={bannerItems}
        numVisible={2}
        numScroll={1}
        circular
        style={{ width: "100%" }}
        showNavigators
        showIndicators={false}
        itemTemplate={(item) => <BannerCard item={item} />}
        autoplayInterval={5000}
        responsiveOptions={[
          { breakpoint: "768px", numVisible: 1, numScroll: 1 }, // Mobile
          { breakpoint: "1024px", numVisible: 2, numScroll: 1 }, // Tablets
        ]}
      />
    </div>
  );
}
