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
  queryData,
  // onLoadMore, // 🔹 added callback from parent
}: IMainSectionProps) {
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
    [isModalOpen],
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
    <section className="mb-16 mt-9 sm:mt-11">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-dispatch text-xl font-medium leading-8 tracking-[-0.02em] text-dispatch-ink sm:text-2xl dark:text-white">
          {title}
        </h2>
        {search && (
          <CustomButton
            label={t("see_all")}
            onClick={onSeeAllClick}
            className="text-secondary-color dark:text-primary-color transition-colors duration-200 text-sm md:text-base"
          />
        )}
      </div>
      {/* if queryData.length not zero then show */}
      {data?.length > 0 && queryData?.length !== 0 ? (
        <>
          <div
            className={`mt-4 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 ${
              isSearchFocused
                ? "lg:grid-cols-3 xl:grid-cols-4"
                : "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
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
                <span>{t("more_button")}</span>
              </div>
            </div>
          )}

          {/* Fallback "Load More" button in case scroll listener misses
          {hasMore && !loading && onLoadMore && (
            <div className="flex justify-center mt-6">
              <CustomButton
                label={t("load_more")}
                onClick={onLoadMore}
                className="px-6 py-2 bg-secondary-color hover:bg-primary-dark text-white rounded-lg"
              />
            </div>
          )} */}
        </>
      ) : (
        <div className="text-center py-6 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <EmptySearch />
        </div>
      )}
    </section>
  );
}

export default MainSection;
