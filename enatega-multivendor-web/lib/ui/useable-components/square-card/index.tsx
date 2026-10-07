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
  // Shop-type / category tiles: full-bleed photo with the label on a scrim,
  // so the card carries no separate text strip.
  if (shoptype && !cuisines) {
    return (
      <article
        className="group relative m-1.5 mb-3 aspect-[5/4] cursor-pointer overflow-hidden rounded-[14px] bg-dispatch-map shadow-[0_4px_16px_rgba(21,25,20,0.06)] ring-1 ring-dispatch-line transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(21,25,20,0.16)] hover:ring-primary-color/60 dark:bg-gray-800 dark:ring-gray-800"
        onClick={onClickHandler}
      >
        {getImgSrc && (
          <Image
            src={getImgSrc}
            alt={item?.name}
            fill
            sizes="(max-width: 320px) 92vw, (max-width: 425px) 46vw, (max-width: 640px) 31vw, (max-width: 1024px) 16vw, (max-width: 1280px) 14vw, (max-width: 1536px) 12vw, 10vw"
            className="object-cover transition duration-500 group-hover:scale-[1.06]"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#151914]/85 via-[#151914]/25 to-transparent transition-opacity duration-300 group-hover:from-[#151914]/90"
        />
        {item?.itemCount != null && (
          <span className="absolute start-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-dispatch-ink shadow-sm backdrop-blur-sm dark:bg-gray-900/85 dark:text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-color" />
            {item.itemCount} {item.itemCountLabel || ""}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5">
          <p className="line-clamp-2 text-sm font-semibold leading-tight tracking-[-0.01em] text-white drop-shadow-sm sm:text-[15px]">
            {item?.name}
          </p>
          <span
            aria-hidden
            className="inline-flex h-6 w-6 shrink-0 translate-x-1 items-center justify-center rounded-full bg-primary-color text-[13px] font-bold text-[#151914] opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 rtl:-scale-x-100"
          >
            →
          </span>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group m-1.5 mb-3 cursor-pointer dark:text-white ${
        cuisines
          ? "overflow-visible bg-transparent"
          : "overflow-hidden rounded-[14px] border border-dispatch-line bg-dispatch-surface shadow-[0_4px_16px_rgba(21,25,20,0.035)] transition duration-300 hover:-translate-y-0.5 hover:border-primary-disabled hover:shadow-[0_12px_28px_rgba(21,25,20,0.09)] dark:border-gray-800 dark:bg-gray-900"
      }`}
      onClick={onClickHandler}
    >
      {/* Image Container */}
      <div
        className={`relative w-full overflow-hidden bg-dispatch-map ring-1 ring-dispatch-line dark:bg-gray-800 ${
          cuisines
            ? "mx-auto aspect-square max-w-28 rounded-full"
          : "aspect-[3/2] rounded-[13px]"
        }`}
      >
        {getImgSrc && (
          <Image
            src={getImgSrc}
            alt={item?.name}
            fill
            sizes={
              cuisines
                ? "112px"
                : "(max-width: 320px) 92vw, (max-width: 425px) 46vw, (max-width: 640px) 31vw, (max-width: 1024px) 16vw, (max-width: 1280px) 14vw, (max-width: 1536px) 12vw, 10vw"
            }
            className="object-cover transition duration-500 group-hover:scale-[1.035]"
          />
        )}
        {!cuisines && item?.itemCount != null && (
          <span className="absolute bottom-2 start-2 rounded-full bg-dispatch-ink/80 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            {item.itemCount} {item.itemCountLabel || ""}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div
        className={`flex flex-grow flex-col justify-between ${
          cuisines
            ? "mx-auto max-w-28 items-center pt-2 text-center"
            : "px-1.5 pb-1.5 pt-2"
        }`}
      >
        <div className="relative flex w-full flex-row items-center justify-between">
          <div className="min-w-0 w-full">
            <p className="line-clamp-1 text-sm font-medium leading-tight text-dispatch-ink dark:text-white sm:text-[15px]">
              {item?.name}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SquareCard;
