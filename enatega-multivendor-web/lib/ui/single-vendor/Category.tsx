"use client";
import { useQuery } from "@apollo/client";
import { SINGLE_VENDOR_CATEGORY } from "@/lib/api/graphql/single-vendor";
import SingleVendorProductSection from "./ProductSection";
import { normalizeProducts } from "./Discovery";

export default function SingleVendorCategory({ categoryId }: { categoryId: string }) {
  const { data, loading, error, fetchMore } = useQuery(SINGLE_VENDOR_CATEGORY, { variables: { categoryId, skip: 0, limit: 24 } });
  const category = data?.getCategoryItemsSingleVendor;
  if (loading) return <div className="h-72 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />;
  if (error) return <p className="py-8 text-red-600">Unable to load this category.</p>;
  return <div className="pb-12"><SingleVendorProductSection title={category?.categoryName ?? "Products"} products={normalizeProducts(category?.items).map((item) => ({ ...item, categoryId }))} />{category?.pagination?.hasMore && <button onClick={() => void fetchMore({ variables: { skip: category.items.length, limit: 24 } })} className="mx-auto block rounded-full bg-primary-color px-6 py-3 font-semibold text-white">Load more</button>}</div>;
}

