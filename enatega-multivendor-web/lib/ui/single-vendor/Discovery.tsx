"use client";

import { useQuery } from "@apollo/client";

import {
  SINGLE_VENDOR_BANNERS,
  SINGLE_VENDOR_CATALOG,
  SINGLE_VENDOR_CATEGORIES,
  SINGLE_VENDOR_LIMITED_DEALS,
  SINGLE_VENDOR_WEEKLY_DEALS,
} from "@/lib/api/graphql/single-vendor";
import type { ModeProduct } from "@/lib/mode/types";
import DiscoveryBannerSection from "@/lib/ui/screen-components/protected/home/discovery/banner-section";
import CuisinesSliderCard from "@/lib/ui/useable-components/cuisines-slider-card";
import CuisinesSliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/cuisines.slider.skeleton";

import SingleVendorProductSection, {
  SingleVendorProductSectionSkeleton,
} from "./ProductSection";
import SingleVendorActiveOrderCard from "./ActiveOrderCard";

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
    <div className="mt-7 rounded-md border border-red-300 px-4 py-8 text-center text-sm text-red-500 dark:border-red-900 dark:text-red-300">
      {message}
    </div>
  );
}

export default function SingleVendorDiscovery() {
  const categories = useQuery(SINGLE_VENDOR_CATEGORIES, {
    fetchPolicy: "cache-and-network",
  });
  const catalog = useQuery(SINGLE_VENDOR_CATALOG, {
    fetchPolicy: "cache-and-network",
  });
  const limited = useQuery(SINGLE_VENDOR_LIMITED_DEALS, {
    fetchPolicy: "cache-and-network",
  });
  const weekly = useQuery(SINGLE_VENDOR_WEEKLY_DEALS, {
    fetchPolicy: "cache-and-network",
  });

  const categoryData = (
    categories.data?.getRestaurantCategoriesSingleVendor || []
  ).map((category: any) => ({
    _id: category.id,
    name: category.name,
    description: category.description,
    image: category.image || category.icon,
    shopType: "single-vendor",
    slug: category.id,
  }));
  const catalogData =
    catalog.data?.getAllCategoriesWithSubCategoriesDataSeeAllSingleVendor || [];

  return (
    <div className="pb-12">
      <DiscoveryBannerSection query={SINGLE_VENDOR_BANNERS} />
      <SingleVendorActiveOrderCard />

      {categories.loading && !categoryData.length ? (
        <CuisinesSliderSkeleton />
      ) : categories.error ? (
        <SectionError message="Unable to fetch categories. Please try again shortly." />
      ) : (
        <CuisinesSliderCard
          title="Browse categories"
          data={categoryData}
          showLogo={false}
          cuisines={false}
          shopTypes
          itemHref={(category) => `/category/${category._id}`}
        />
      )}

      {limited.loading && !limited.data ? (
        <SingleVendorProductSectionSkeleton />
      ) : (
        <SingleVendorProductSection
          title="Limited-time offers"
          products={normalizeProducts(
            limited.data?.getLimitedTimeFoodsDeals?.items,
          )}
        />
      )}

      {weekly.loading && !weekly.data ? (
        <SingleVendorProductSectionSkeleton />
      ) : (
        <SingleVendorProductSection
          title="Weekly offers"
          products={normalizeProducts(weekly.data?.getWeeklyFoodsDeals?.items)}
        />
      )}

      {catalog.loading && !catalogData.length ? (
        <SingleVendorProductSectionSkeleton />
      ) : catalog.error ? (
        <SectionError message="Unable to fetch products. Please try again shortly." />
      ) : (
        catalogData.map((category: any) => (
          <SingleVendorProductSection
            key={category.categoryId}
            title={category.categoryName}
            products={normalizeProducts(category.items).map((product) => ({
              ...product,
              categoryId: category.categoryId,
            }))}
          />
        ))
      )}
    </div>
  );
}

export { normalizeProducts };
