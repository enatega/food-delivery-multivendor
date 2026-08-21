"use client";
import { useQuery } from "@apollo/client";
import { SINGLE_VENDOR_DISCOVERY } from "@/lib/api/graphql/single-vendor";
import SingleVendorProductSection from "./ProductSection";
import { normalizeProducts } from "./Discovery";
import { useTranslations } from "next-intl";

export default function SingleVendorDeals() {
  const t = useTranslations();
  const discovery = useQuery(SINGLE_VENDOR_DISCOVERY, {
    variables: { previewLimit: 10, dealLimit: 40 },
    fetchPolicy: "cache-and-network",
  });
  if (discovery.loading && !discovery.data) return <div className="h-72 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />;
  const deals = discovery.data?.singleVendorDiscovery?.deals;
  const products = normalizeProducts([
    ...(deals?.limitedTime?.items || []),
    ...(deals?.weekly?.items || []),
  ]).filter(
    (product, index, items) =>
      items.findIndex((candidate) => candidate.id === product.id) === index,
  );
  return <div className="pb-12"><SingleVendorProductSection title={t("discount_label")} products={products} /></div>;
}
