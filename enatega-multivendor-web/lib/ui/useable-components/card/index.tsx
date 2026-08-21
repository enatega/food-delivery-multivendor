"use client";

// core
import Image from "@/lib/ui/useable-components/safe-image";
import React from "react";
import { useRouter } from "next/navigation";

// Assets
import { FiClock, FiStar } from "react-icons/fi";

// Hooks
import { useSearchUI } from "@/lib/context/search/search.context";

// Interface
import { ICardProps } from "@/lib/utils/interfaces";
import { saveSearchedKeyword } from "@/lib/utils/methods";
import { isRestaurantOpen } from "@/lib/utils/constants/isRestaurantOpen";
import CustomDialog from "../custom-dialog";
import { Button } from "primereact/button";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import { useTranslations } from "next-intl";

const Card: React.FC<ICardProps> = ({
  item,
  isModalOpen = { value: false, id: "" },
  handleUpdateIsModalOpen = () => {},
}) => {
  const router = useRouter();
  const t = useTranslations();
  const { setIsSearchFocused, setFilter, filter } = useSearchUI();

  const { CURRENCY_SYMBOL } = useConfig();
  const isOpen = isRestaurantOpen(item);

  return (
    <div
      role="link"
      tabIndex={0}
      className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-dispatch-line bg-dispatch-surface transition-shadow hover:shadow-[0_12px_30px_rgba(21,25,20,0.09)] focus-visible:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
      onClick={() => {
        if (!isOpen) {
          handleUpdateIsModalOpen(true, item._id);
          return;
        }

        router.push(
          `/${item.shopType === "restaurant" ? "restaurant" : "store"}/${item?.slug}/${item._id}`,
        );

        setFilter("");
        setIsSearchFocused(false);
        saveSearchedKeyword(filter);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-dispatch-map">
        <Image
          src={item?.image}
          alt={item?.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.025]"
          unoptimized
        />
      </div>

      {/* Overlay if closed */}
      {!isOpen && (
        <div className="absolute inset-x-0 top-0 z-20 flex aspect-[16/9] items-center justify-center bg-dispatch-ink/35 backdrop-blur-[2px]">
          <div className="z-30 px-3 text-center text-white drop-shadow-sm">
            <p className="text-sm font-medium sm:text-base">
              {t("closed_label")}
            </p>
            <p className="mt-0.5 hidden text-xs sm:block">
              {t("currently_closed_message")}
            </p>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-col justify-between p-2.5">
        {/* Name & Cuisines */}
        <div className="relative min-w-0">
          <div className="min-w-0 flex-1">
            <p
              title={item?.name}
              className="line-clamp-1 text-[15px] font-medium leading-tight text-dispatch-ink dark:text-white sm:text-base"
            >
              {item?.name}
            </p>
            <p className="mt-1 line-clamp-1 text-xs text-dispatch-muted dark:text-gray-400">
              {item?.cuisines.map((cuisine) => cuisine).join(", ")}
            </p>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dispatch-muted">
          {item?.deliveryTime != null && (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <FiClock aria-hidden />
              {item.deliveryTime} {t("min_label")}
            </span>
          )}
          {item?.reviewAverage != null && (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <FiStar aria-hidden className="text-primary-dark" />
              {item.reviewAverage}
            </span>
          )}
          {item?.minimumOrder != null && (
            <span className="tabular-nums">
              {CURRENCY_SYMBOL}
              {item.minimumOrder}
            </span>
          )}
        </div>
      </div>

      {/* Closed Modal */}
      <CustomDialog
        className="max-w-[300px]"
        visible={isModalOpen.value && isModalOpen.id === item._id}
        onHide={() => handleUpdateIsModalOpen(false, item._id)}
      >
        <div className="text-center pt-10 dark:text-white">
          <p className="text-lg font-bold pb-3">
            {item.shopType === "restaurant"
              ? t("restaurant_label")
              : t("store_label")}{" "}
            {t("is_closed_label")}
          </p>
          <p className="text-sm">{t("see_menu_prompt")}</p>
          <div className="flex pt-9 px-2 pb-2 flex-row justify-center items-center gap-2 w-full">
            <Button
              style={{ fontSize: "14px", fontWeight: "normal" }}
              onClick={() => handleUpdateIsModalOpen(false, item._id)}
              label={t("close_label")}
              className="w-1/2 bg-red-300 text-base font-normal text-black rounded-md min-h-10 dark:bg-red-500 dark:text-white"
            />
            <Button
              style={{ fontSize: "14px", fontWeight: "normal" }}
              onClick={() => {
                handleUpdateIsModalOpen(false, item._id);
                setFilter("");
                setIsSearchFocused(false);

                setTimeout(() => {
                  router.push(
                    `/${item.shopType === "restaurant" ? "restaurant" : "store"}/${item?.slug}/${item._id}`,
                  );
                }, 100);
              }}
              label={t("see_menu_label")}
              className="w-1/2 bg-primary-color text-base font-normal text-black rounded-md min-h-10 dark:text-black"
            />
          </div>
        </div>
      </CustomDialog>
    </div>
  );
};

export default Card;
