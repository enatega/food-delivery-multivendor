"use client";

import Image from "@/lib/ui/useable-components/safe-image";
import React from "react";
// import { ClockSvg, CycleSvg, FaceSvg } from "@/lib/utils/assets/svg";
// import IconWithTitle from "../icon-with-title";
import { ICuisinesCardProps } from "@/lib/utils/interfaces";
import { useRouter } from "next/navigation";

const SquareCard: React.FC<ICuisinesCardProps> = ({
  item,
  cuisines = false,
  showLogo = false,
  shoptype,
  href,
}) => {
  const router = useRouter();
  const getImgSrc = showLogo ? item?.logo : item?.image;

  const onClickHandler = () => {
    if (href) {
      router.push(href);
      return;
    }
    if (shoptype) {
      router.push(`/shop-type/${item?.slug}`);
      return;
    }
    if (!cuisines) {
      router.push(
        `/${item?.shopType === "restaurant" ? "restaurant" : "store"}/${item?.slug}/${item._id}`,
      );
    } else {
      router.push(`/category/${item.name.toLowerCase().replace(/\s/g, "-")}`);
    }
  };
  return (
    <article
      className="group m-1.5 mb-3 cursor-pointer overflow-hidden rounded-xl bg-dispatch-surface dark:bg-gray-900 dark:text-white"
      onClick={onClickHandler}
    >
      {/* Image Container */}
      <div
        className={`relative w-full overflow-hidden bg-dispatch-map ring-1 ring-dispatch-line dark:bg-gray-800 ${
          cuisines
            ? "mx-auto aspect-square max-w-28 rounded-full"
            : "aspect-[3/2] rounded-xl"
        }`}
      >
        {getImgSrc && (
          <Image
            src={getImgSrc}
            alt={item?.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        )}
      </div>

      {/* Content Section */}
      <div
        className={`flex flex-grow flex-col justify-between px-1 pt-2 ${cuisines ? "text-center" : ""}`}
      >
        <div className="flex flex-row justify-between items-center relative">
          <div className="min-w-0">
            <p className="line-clamp-1 text-sm font-normal leading-tight text-dispatch-ink dark:text-white sm:text-[15px]">
              {item?.name}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SquareCard;
