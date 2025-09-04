import { Carousel } from "primereact/carousel";
// query
import { GET_BANNERS } from "@/lib/api/graphql/queries";
// gql
import { useQuery } from "@apollo/client";
// loading skeleton
import DiscoveryBannerSkeleton from "@/lib/ui/useable-components/custom-skeletons/banner.skeleton";
// Interface
import { IGetBannersResponse } from "@/lib/utils/interfaces";
// banner card
import BannerCard from "./banner-card";
import { useEffect, useState } from "react";

export default function DiscoveryBannerSection() {
  const { data, loading, error } = useQuery<IGetBannersResponse>(GET_BANNERS, {
    fetchPolicy: "cache-and-network",
  });

   // Check if RTL (client-side only)
   const [isRTL, setIsRTL] = useState(false);
   useEffect(() => {
     setIsRTL(document.documentElement.dir === "rtl");
   }, []);
  
  if (loading) {
    return <DiscoveryBannerSkeleton />;
  }
  if (error) {
    return;
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
    <Carousel
      className={`discovery-carousel ${isRTL ? "rtl-carousel" : ""}`} // Add RTL class
      value={data?.banners}
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
