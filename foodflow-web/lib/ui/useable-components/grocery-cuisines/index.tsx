// cuisines slider card
import CuisinesSliderCard from "@/lib/ui/useable-components/cuisines-slider-card";
// hook
import useGetCuisines from "@/lib/hooks/useGetCuisines";
// loading skeleton
import CuisinesSliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/cuisines.slider.skeleton";

function GroceryCuisines({title="Grocery cuisines"}: {title?:string}) {
  const { loading, error, groceryCuisinesData } = useGetCuisines();

  if (loading) {
    return <CuisinesSliderSkeleton />;
  }

  if (error) {
    return;
  }

  return (
    <CuisinesSliderCard
      title={title}
      data={groceryCuisinesData || []}
      cuisines={true}
    />
  );
}

export default GroceryCuisines;
