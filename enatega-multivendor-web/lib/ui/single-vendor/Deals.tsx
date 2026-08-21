"use client";
import { useQuery } from "@apollo/client";
import { SINGLE_VENDOR_DISCOVERY } from "@/lib/api/graphql/single-vendor";
import SingleVendorProductSection from "./ProductSection";
import { SingleVendorProductSectionSkeleton } from "./ProductSection";
import { normalizeProducts } from "./Discovery";
import { useTranslations } from "next-intl";

export default function SingleVendorDeals() {
  const t = useTranslations();
  const discovery = useQuery(SINGLE_VENDOR_DISCOVERY, {
    variables: { previewLimit: 10, dealLimit: 40 },
    fetchPolicy: "cache-and-network",
  });
  if (discovery.loading && !discovery.data) {
    return (
      <div className="pb-12">
        <SingleVendorProductSectionSkeleton />
      </div>
    );
  }

  if (discovery.error && !discovery.data) {
    return (
      <div className="flex min-h-64 items-center justify-center border-y border-dispatch-line py-12 text-center text-sm text-dispatch-muted dark:border-gray-800">
        {t("something_went_wrong_please_try_again")}
      </div>
    );
  }
  const deals = discovery.data?.singleVendorDiscovery?.deals;
  const products = normalizeProducts([
    ...(deals?.limitedTime?.items || []),
    ...(deals?.weekly?.items || []),
  ]).filter(
    (product, index, items) =>
      items.findIndex((candidate) => candidate.id === product.id) === index,
  );
  return (
    <div className="pb-12">
      {products.length > 0 ? (
        <SingleVendorProductSection
          title={t("discount_label")}
          products={products}
        />
      ) : (
        <div className="flex min-h-64 items-center justify-center border-y border-dispatch-line py-12 text-center text-sm text-dispatch-muted dark:border-gray-800">
          {t("no_items_found")}
        </div>
      )}
    </div>
  );
}
