// core
import React from "react";
import Image from "@/lib/ui/useable-components/safe-image";
// interface
import { IBannerItemProps } from "@/lib/utils/interfaces";
import { useRouter } from "next/navigation";
import { useAppMode } from "@/lib/mode";

const BannerCard: React.FC<IBannerItemProps> = ({ item }) => {
  const isVideo =
    item?.file?.includes(".mp4") ||
    item?.file?.includes(".webm") ||
    item?.file?.includes("video");

  const router = useRouter();
  const { isSingleVendor } = useAppMode();

  const getSingleVendorTarget = () => {
    const rawParameters = item?.parameters;
    let parameters: Record<string, string> = {};

    if (typeof rawParameters === "string") {
      try {
        parameters = JSON.parse(rawParameters);
      } catch {
        parameters = {};
      }
    } else if (Array.isArray(rawParameters)) {
      parameters = Object.fromEntries(
        rawParameters
          .map((entry) => entry.split("="))
          .filter(([key, value]) => key && value),
      );
    }

    const screen = item?.screen?.toLowerCase();
    const categoryId = parameters.categoryId || parameters.id || item?.slug;
    const foodId = parameters.foodId || parameters.productId || parameters.id;

    if (screen === "category" && categoryId) return `/category/${categoryId}`;
    if (screen === "product" && foodId) return `/product/${foodId}`;
    if (screen?.includes("deal")) return "/deals";
    return "/browse";
  };

  const onClickHandler = () => {
    if (isSingleVendor) {
      router.push(getSingleVendorTarget());
      return;
    }
    if (item?.action === "Navigate Specific Restaurant") {
      router.push(
        `/${item?.shopType === "restaurant" ? "restaurant" : "store"}/${item?.slug}/${item?.screen}`,
      );
    } else {
      if (item?.screen === "Top Brands") {
        router.push("/see-all/popular-stores");
      } else if (item?.screen === "Near By Restaurants") {
        router.push("/see-all/restaurants-near-you");
      } else {
        router.push("/store");
      }
    }
  };
  return (
    <>
      <div
        className="carousel-item relative cursor-pointer mx-[6px] md:mx-[12px]"
        onClick={onClickHandler}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent rounded-xl opacity-70"></div>
        {isVideo ? (
          <video
            width={890}
            height={300}
            loop
            muted
            playsInline
            autoPlay
            preload="none"
            style={{ borderRadius: 12 }}
            className="carousel-banner"
            // onError={(e) => console.error('Video error:', e.currentTarget.error)}
            // onCanPlay={() => console.log('Video can play:', item?.file)}
          >
            <source src={item?.file} type="video/mp4" />
            <source src={item?.file} type="video/webm" />
          </video>
        ) : (
          <Image
            src={item?.file}
            width={480}
            height={300}
            alt={item?.title}
            style={{ borderRadius: 12, objectFit: "contain" }}
            className="carousel-banner"
          />
        )}
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-lg sm:text-2xl font-bold sm:font-extrabold">
            {item?.title}
          </p>
          <p className="text-xs sm:text-sm font-medium">{item?.description}</p>
        </div>
      </div>
    </>
  );
};

export default BannerCard;
