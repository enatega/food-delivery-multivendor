// core
import React, { useCallback, useState } from "react";
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

  // Handle update is modal open
  const handleUpdateIsModalOpen = useCallback((value: boolean, id: string) => {
    if (isModalOpen.value !== value || isModalOpen.id !== id) {
      setIsModalOpen({ value, id });
    }
  }, [isModalOpen]);
  
  // Get slug from URL params
  const params = useParams();
  const t = useTranslations()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  // Generate a formatted title from the slug
  let title = slug
    .replaceAll("-", " ")
    .replace(/^./, (str) => str.toUpperCase());

  // Get data form context
  const { searchedData:data } = useSearchUI();

  // If no data returned, show empty state
  if (!data?.length) return <div className="text-center text-2xl font-bold">No items found</div>;

  return (
    <>
      <HomeHeadingSection title={`${t('restaurant_and_stores_title')}: ` + title} showFilter={false} />
      <div className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-4 items-center">
          {data.map((item) => (
              <Card key={item._id} item={item} isModalOpen={isModalOpen} handleUpdateIsModalOpen={handleUpdateIsModalOpen} />
            ))}
        </div>
      </div>
    </>
  );
}

export default SearchSeeAllSection;
