"use client";

import React, { useCallback, useState } from "react";
import Card from "@/lib/ui/useable-components/card";
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
import { IMainSectionProps } from "@/lib/utils/interfaces";
import { useSearchUI } from "@/lib/context/search/search.context";
import CustomButton from "../button";
import { useRouter } from "next/navigation";
import { saveSearchedKeyword } from "@/lib/utils/methods";
import EmptySearch from "../empty-search-results";
import { useTranslations } from "next-intl";

function MainSection({
  title,
  data,
  error,
  loading,
  search,
  hasMore,
  // onLoadMore, // 🔹 added callback from parent
}: IMainSectionProps ) {
  const router = useRouter();
  const t = useTranslations();
  const { isSearchFocused, setIsSearchFocused, filter } = useSearchUI();

  const [isModalOpen, setIsModalOpen] = useState({ value: false, id: "" });
  const handleUpdateIsModalOpen = useCallback(
    (value: boolean, id: string) => {
      if (isModalOpen.value !== value || isModalOpen.id !== id) {
        setIsModalOpen({ value, id });
      }
    },
    [isModalOpen]
  );

  if (error) {
    return null;
  }

  if (loading && (!data || data.length === 0)) {
    return <SliderSkeleton />;
  }

  const onSeeAllClick = () => {
    setIsSearchFocused(false);
    saveSearchedKeyword(filter);
    const keyword = title
      ?.split(":")[1]
      ?.trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (keyword) {
      router.push(`/search/${keyword}`);
    }
  };

  return (
    <div className="mb-20">
      <div className="mx-[6px] flex items-center gap-0 justify-between">
        <span className="font-inter font-bold text-xl sm:text-2xl leading-8 tracking-normal text-gray-900 dark:text-white">
          {title}
        </span>
        {search && (
          <CustomButton
            label={t("see_all")}
            onClick={onSeeAllClick}
            className="text-[#0EA5E9] dark:text-[#94e469] transition-colors duration-200 text-sm md:text-base"
          />
        )}
      </div>

      {data?.length > 0 ? (
        <>
          <div
            className={`grid grid-cols-1 gap-2 mt-4 items-center ${
              isSearchFocused
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "md:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {data.map((item) => (
              <Card
                key={item._id}
                item={item}
                isModalOpen={isModalOpen}
                handleUpdateIsModalOpen={handleUpdateIsModalOpen}
              />
            ))}
          </div>

          {/* Loader for pagination */}
          {loading && hasMore && (
            <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 text-gray-500">
              <svg
                className="animate-spin h-5 w-5 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>Loading more...</span>
            </div>
          </div>
          )}

          {/* Fallback "Load More" button in case scroll listener misses
          {hasMore && !loading && onLoadMore && (
            <div className="flex justify-center mt-6">
              <CustomButton
                label={t("load_more")}
                onClick={onLoadMore}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg"
              />
            </div>
          )} */}
        </>
      ) : (
        <div className="text-center py-6 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <EmptySearch />
        </div>
      )}
    </div>
  );
}

export default MainSection;
