"use client";
import SliderCard from "@/lib/ui/useable-components/slider-card";
// Hook

// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";

function GroceryList({data,loading,error}) {
  // const { error, loading, groceriesData } = useNearByRestaurantsPreview();

  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return;
  }

  return (
    <SliderCard
      title="Grocery list"
      data={data || []}
      heading="grocerylist"
    />
  );
}

export default GroceryList;
