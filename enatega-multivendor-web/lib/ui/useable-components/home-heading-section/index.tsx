"use client";

import React from "react";
// icons
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MapViewButton from "../mapViewButton";
import { useTranslations } from "next-intl";
function HomeHeadingSection({
  title,
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
  const t = useTranslations();
  const headingTitle = t.has(title) ? t(title) : title;

  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-dispatch-line pb-5 sm:flex-row sm:items-end sm:justify-between sm:pb-6 dark:border-gray-800">
      <h1 className="font-dispatch text-2xl font-semibold leading-tight tracking-[-0.025em] text-dispatch-ink sm:text-3xl dark:text-white">
        {headingTitle}
      </h1>
      <div className="flex items-center gap-2">
        <MapViewButton />
        {showFilter && (
          <button
            type="button"
            onClick={onPress}
            className="relative inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-dispatch-map px-3.5 text-sm font-medium text-dispatch-ink transition-colors hover:bg-primary-light hover:text-primary-dark focus-visible:outline-none dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
          >
            <FontAwesomeIcon icon={faFilter} aria-hidden className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("sort_by")} {sortByTitle}
            </span>
            <span className="sr-only sm:hidden">{t("filters")}</span>
            <span className="relative">
              {(appliedFilters ?? 0) > 0 && (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary-color px-1.5 py-0.5 text-[10px] font-semibold text-dispatch-ink">
                  {appliedFilters}
                </span>
              )}
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
export default HomeHeadingSection;
