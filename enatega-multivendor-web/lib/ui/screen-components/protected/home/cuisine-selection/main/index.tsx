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
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [isModalOpen, setIsModalOpen] = useState({value: false, id: ""});
  
  let slugWithSpaces = slug.replaceAll("-", " ");
  let title =
    slugWithSpaces?.replace(/^./, (str) => str.toUpperCase()) + " near you";

  const { queryData, loading, error } = useNearByRestaurantsPreview();

  let getCuisinRestaurants = queryData?.filter((item) =>
    item?.cuisines.map((item) => item.toLowerCase()).includes(slugWithSpaces)
  );

  const handleUpdateIsModalOpen = useCallback((value: boolean, id: string) => {
    if (isModalOpen.value !== value || isModalOpen.id !== id) {
      console.log("value, id", value, id);
      setIsModalOpen({ value, id });
    }
  }, [isModalOpen]);

  if (loading) {
    return <SliderSkeleton />;
  }
  if (error) {
    return;
  }

  if (!queryData?.length) return <div>No items found</div>;

  return (
    <>
      <HomeHeadingSection title={title} />
      <div className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-4 items-center">
          {(getCuisinRestaurants as IRestaurant[]).map((item) => (
            <Card key={item._id} item={item} isModalOpen={isModalOpen} handleUpdateIsModalOpen={handleUpdateIsModalOpen} />
          ))}
        </div>
      </div>
    </>
  );
}

export default CuisineSelectionSection;
