"use client";

import CuisinesSliderCard from "@/lib/ui/useable-components/cuisines-slider-card";
import CuisinesSliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/cuisines.slider.skeleton";
import { useQuery } from "@apollo/client";
import { FETCH_ALL_SHOP_TYPES } from "@/lib/api/graphql/queries/shop-type";
import { useTranslations } from "next-intl";

function ShopTypes() {
  const t = useTranslations();
  const { data, loading, error } = useQuery(FETCH_ALL_SHOP_TYPES);

  if (loading) {
    return <CuisinesSliderSkeleton />;
  }

  if (error) {
    return (
      <div className="mt-10 border-t border-dispatch-line pt-6">
        <div className="flex justify-start mb-4">
          <h2 className="text-xl font-medium tracking-[-0.02em] text-dispatch-ink sm:text-2xl dark:text-white">
            {t("shop-types")}
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center border border-red-300 bg-red-50 py-10 dark:border-red-900 dark:bg-red-950/20">
          <p className="text-red-400 text-center mb-3">
            {t("something_went_wrong_please_try_again")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <CuisinesSliderCard
      title="shop-types"
      data={data?.fetchAllShopTypes?.data || []}
      showLogo={false}
      cuisines={false}
      shopTypes={true}
    />
  );
}

export default ShopTypes;
