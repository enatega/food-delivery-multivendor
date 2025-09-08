// slider card
import SliderCard from "@/lib/ui/useable-components/slider-card";
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
// hook
import useRecentOrderRestaurants from "@/lib/hooks/useRecentOrderRestaurants";

function OrderItAgain() {
  const { loading, queryData, error } = useRecentOrderRestaurants()

  if (loading) {
    <SliderSkeleton />;
  }

  if (error) {
    return;
  }

  return (
    <SliderCard heading="" title="Order it again" data={queryData || []} />
  );
}
export default OrderItAgain;
