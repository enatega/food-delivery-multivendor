"use client";

import React from "react";
// icons
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomButton from "../button";
import MapViewButton from "../mapViewButton";
import { useTranslations } from "next-intl";
function HomeHeadingSection({
  title = "Restaurants near me",
  onPress,
  appliedFilters,
  sortByTitle,
  showFilter = true,
}: {
  title: string;
  onPress?: () => void;
  appliedFilters?: number;
  sortByTitle?: string;
  showFilter?: boolean;
}) {

  const t = useTranslations()
  return (
    <div className="flex justify-between items-center mx-[6px] mb-8">
      <span className="font-inter font-bold text-2xl sm:text-4xl leading-8 tracking-normal text-gray-900">
        {title}
      </span>
      <div className="flex items-center gap-4">
        <MapViewButton />
        {showFilter && (
          <div className="flex items-center justify-end gap-x-2">
            <CustomButton
              label={`${t('sort_by')} ${sortByTitle}`}
              onClick={onPress}
              className="text-sky-500 transition-colors duration-200 text-sm md:text-base hidden sm:block"
            />
            {/* Filter Buttons */}
            <div className="relative w-8 h-8" onClick={onPress}>
              {(appliedFilters ?? 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[10px] px-1.5 py-[1px] rounded-full z-10">
                  {appliedFilters}
                </span>
              )}
              <button className="w-8 h-8 flex items-center justify-center  shadow-md  rounded-full">
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default HomeHeadingSection;
