// core
import React, { useCallback, useState } from "react";
// card component
import Card from "@/lib/ui/useable-components/card";
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
// useParams
import { useParams } from "next/navigation";
// heading component
import HomeHeadingSection from "@/lib/ui/useable-components/home-heading-section";
// interface
import { IRestaurant } from "@/lib/utils/interfaces/restaurants.interface";
// hooks
import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";

function CuisineSelectionSection() {
  const params = useParams() as Record<string, string | string[]>;

  // Safely pick the dynamic segment (supports /category/[id], /[slug], etc.)
  const pickParam = (key: string) =>
    Array.isArray(params[key]) ? (params[key] as string[])[0] : (params[key] as string | undefined);

  const rawParam =
    pickParam("category") ?? // e.g., /category/[id]
    pickParam("slug") ??     // e.g., /cuisine/[slug]
    pickParam("id") ??       // fallback if route uses [id]
    "";

  // Decode `%D7%...` etc. and prepare human-readable slug
  const decoded = decodeURIComponent(rawParam);
  const slugWithSpaces = decoded.replace(/-/g, " ").trim();

  // Normalize for reliable matching across scripts (Hebrew, etc.)
  const normalizedSlug = slugWithSpaces.normalize("NFKC").toLocaleLowerCase();

  // Title (avoid forcing Latin-style capitalization)
  const title = `${slugWithSpaces} near you`;

  const [isModalOpen, setIsModalOpen] = useState({ value: false, id: "" });

  const { queryData, loading, error } = useNearByRestaurantsPreview(true,1,109,null);

  const getCuisinRestaurants = queryData?.filter((item) =>
    item?.cuisines?.some(
      (c) => c?.toString().normalize("NFKC").toLocaleLowerCase() === normalizedSlug
    )
  );

  const handleUpdateIsModalOpen = useCallback(
    (value: boolean, id: string) => {
      if (isModalOpen.value !== value || isModalOpen.id !== id) {
        setIsModalOpen({ value, id });  
      }
    },
    [isModalOpen]
  );

  if (loading) return <SliderSkeleton />;
  if (error) return null;

  if (!queryData?.length) return <div>No items found</div>;

  return (
    <>
      <HomeHeadingSection title={title} />
      <div className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-4 items-center">
          {(getCuisinRestaurants as IRestaurant[] | undefined)?.map((item) => (
            <Card
              key={item._id}
              item={item}
              isModalOpen={isModalOpen}
              handleUpdateIsModalOpen={handleUpdateIsModalOpen}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default CuisineSelectionSection;
