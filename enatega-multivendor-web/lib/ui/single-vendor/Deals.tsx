"use client";
import { useQuery } from "@apollo/client";
import { SINGLE_VENDOR_LIMITED_DEALS, SINGLE_VENDOR_WEEKLY_DEALS } from "@/lib/api/graphql/single-vendor";
import SingleVendorProductSection from "./ProductSection";
import { normalizeProducts } from "./Discovery";

export default function SingleVendorDeals() {
  const limited = useQuery(SINGLE_VENDOR_LIMITED_DEALS);
  const weekly = useQuery(SINGLE_VENDOR_WEEKLY_DEALS);
  if (limited.loading || weekly.loading) return <div className="h-72 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />;
  return <div className="pb-12"><SingleVendorProductSection title="Limited-time offers" products={normalizeProducts(limited.data?.getLimitedTimeFoodsDeals?.items)} /><SingleVendorProductSection title="Weekly offers" products={normalizeProducts(weekly.data?.getWeeklyFoodsDeals?.items)} /></div>;
}

