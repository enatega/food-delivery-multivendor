// core
import React from "react";
import Image from "next/image";
// interface
import { IBannerItemProps } from "@/lib/utils/interfaces";
import { useRouter } from "next/navigation";

const BannerCard: React.FC<IBannerItemProps> = ({ item }) => {
  const isVideo = item?.file.includes("video");

  const router = useRouter();
  const onClickHandler = () => {
    if (item?.action === "Navigate Specific Restaurant") {
      router.push(
        `/${item?.shopType === "restaurant" ? "restaurant" : "store"}/${item?.slug}/${item?.screen}`
      );
    } else {
      if (item?.screen === "Top Brands") {
        router.push("/our-brands");
      } else if (item?.screen === "Near By Restaurants") {
        router.push("/restaurants-near-you");
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
            preload="metadata"
            style={{ borderRadius: 12 }}
            className="carousel-banner"
          >
            <source src={item?.file} type="video/mp4" />
            {item.title}
          </video>
        ) : (
          <Image
            src={item?.file}
            width={480}
            height={300}
            alt={item?.title}
            objectFit="contain"
            style={{ borderRadius: 12 }}
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
