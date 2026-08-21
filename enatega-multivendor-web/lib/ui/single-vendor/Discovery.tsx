"use client";

import { useQuery } from "@apollo/client";

import { SINGLE_VENDOR_DISCOVERY } from "@/lib/api/graphql/single-vendor";
import type { ModeProduct } from "@/lib/mode/types";
import DiscoveryBannerSection from "@/lib/ui/screen-components/protected/home/discovery/banner-section";
import CuisinesSliderCard from "@/lib/ui/useable-components/cuisines-slider-card";
import CuisinesSliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/cuisines.slider.skeleton";

import SingleVendorProductSection, {
  SingleVendorProductSectionSkeleton,
} from "./ProductSection";
import SingleVendorActiveOrderCard from "./ActiveOrderCard";
import { useTranslations } from "next-intl";

const normalizeProducts = (items: any[] = []): ModeProduct[] =>
  items.map((item) => ({
    id: item.id || item._id,
    title: item.title,
    description: item.description,
    image: item.image,
    categoryId: item.categoryId,
    variations: (item.variations || []).map((variation: any) => ({
      id: variation.id || variation._id,
      title: variation.title,
      name: variation.name,
      price: Number(
        variation.deal?.isActive
          ? variation.price -
              (variation.deal.discountType === "percentage"
                ? (variation.price * variation.deal.discountValue) / 100
                : variation.deal.discountValue)
          : variation.price,
      ),
    })),
  }));

function SectionError({ message }: { message: string }) {
  return (
    <div className="mt-7 rounded-xl border border-red-300 px-4 py-8 text-center text-sm text-red-500 dark:border-red-900 dark:text-red-300">
      {message}
    </div>
  );
}

export default function SingleVendorDiscovery() {
  const t = useTranslations();
  const discovery = useQuery(SINGLE_VENDOR_DISCOVERY, {
    variables: { previewLimit: 10, dealLimit: 20 },
    fetchPolicy: "cache-and-network",
  });
  const discoveryData = discovery.data?.singleVendorDiscovery;

  const categoryData = (discoveryData?.categories || []).map(
    (category: any) => ({
      _id: category.id,
      name: category.name,
      description: category.description,
      image: category.image || category.icon,
      shopType: "single-vendor",
      slug: category.id,
    }),
  );
  const catalogData = discoveryData?.categories || [];
  const dealProducts = normalizeProducts([
    ...(discoveryData?.deals?.limitedTime?.items || []),
    ...(discoveryData?.deals?.weekly?.items || []),
  ]).filter(
    (product, index, products) =>
      products.findIndex((candidate) => candidate.id === product.id) === index,
  );

  return (
    <div className="pb-12">
      <DiscoveryBannerSection
        banners={discoveryData?.banners}
        loading={discovery.loading}
        error={discovery.error}
      />
      <SingleVendorActiveOrderCard />

      {discovery.loading && !categoryData.length ? (
        <CuisinesSliderSkeleton />
      ) : discovery.error ? (
        <SectionError message={t("something_went_wrong_please_try_again")} />
      ) : (
        <CuisinesSliderCard
          title={t("shop-types")}
          data={categoryData}
          showLogo={false}
          cuisines={false}
          shopTypes
          itemHref={(category) => `/category/${category._id}`}
        />
      )}

      {discovery.loading && !discovery.data ? (
        <SingleVendorProductSectionSkeleton />
      ) : (
        <SingleVendorProductSection
          title={t("discount_label")}
          products={dealProducts}
        />
      )}

      {discovery.loading && !catalogData.length ? (
        <SingleVendorProductSectionSkeleton />
      ) : discovery.error ? (
        <SectionError message={t("something_went_wrong_please_try_again")} />
      ) : (
        catalogData.map((category: any) => (
          <SingleVendorProductSection
            key={category.id}
            title={category.name}
            products={normalizeProducts(category.items).map((product) => ({
              ...product,
              categoryId: category.id,
            }))}
          />
        ))
      )}
    </div>
  );
}

export { normalizeProducts };
