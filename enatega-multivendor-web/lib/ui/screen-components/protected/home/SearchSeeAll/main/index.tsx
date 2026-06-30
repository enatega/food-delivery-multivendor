// core
import React, { useCallback, useEffect, useMemo, useState } from "react";
// card component
import Card from "@/lib/ui/useable-components/card";
// hooks
import { useSearchUI } from "@/lib/context/search/search.context";
// useParams
import { useParams } from "next/navigation";
// heading component
import HomeHeadingSection from "@/lib/ui/useable-components/home-heading-section";
import { useTranslations } from "next-intl";


function SearchSeeAllSection() {
  // State to handle modal open
  const [isModalOpen, setIsModalOpen] = useState({value: false, id: ""});
  const [visibleCount, setVisibleCount] = useState(24);
  const PAGE_SIZE = 24;

  // Handle update is modal open
  const handleUpdateIsModalOpen = useCallback((value: boolean, id: string) => {
    setIsModalOpen((current) =>
      current.value !== value || current.id !== id ? { value, id } : current
    );
  }, []);
  
  // Get slug from URL params
  const params = useParams();
  const t = useTranslations()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  // Generate a formatted title from the slug
  let title = slug
    ? slug.replaceAll("-", " ").replace(/^./, (str) => str.toUpperCase())
    : "";

  // Get data form context
  const { searchedData:data } = useSearchUI();
  const visibleData = useMemo(
    () => data.slice(0, visibleCount),
    [data, visibleCount]
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [data, PAGE_SIZE]);

  // If no data returned, show empty state
  if (!data?.length) return <div className="text-center text-2xl font-bold">No items found</div>;

  return (
    <>
      <HomeHeadingSection title={`${t('restaurant_and_stores_title')}: ` + title} showFilter={false} />
      <div className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-4 items-center">
          {visibleData.map((item) => (
              <Card key={item._id} item={item} isModalOpen={isModalOpen} handleUpdateIsModalOpen={handleUpdateIsModalOpen} />
            ))}
        </div>
        {visibleCount < data.length && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, data.length))}
              className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default SearchSeeAllSection;
