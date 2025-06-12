"use client";

// cuisines slider card
import CuisinesSliderCard from "@/lib/ui/useable-components/cuisines-slider-card";
// hook
// import useGetCuisines from "@/lib/hooks/useGetCuisines";
// loading skeleton
import CuisinesSliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/cuisines.slider.skeleton";
// interface
import { ICuisinesData, ICuisinesSectionProps } from "@/lib/utils/interfaces";

function CuisinesSection({
  title,
  data,
  loading,
  error,
}: ICuisinesSectionProps) {
  if (loading) {
    return <CuisinesSliderSkeleton />;
  }

  if (error) {
    return;
  }

  return (
    <CuisinesSliderCard<ICuisinesData>
      title={title}
      data={data || []}
      cuisines={true}
    />
  );
}

export default CuisinesSection;
