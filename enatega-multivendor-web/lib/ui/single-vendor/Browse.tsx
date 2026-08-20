"use client";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SINGLE_VENDOR_CATEGORIES, SINGLE_VENDOR_SEARCH } from "@/lib/api/graphql/single-vendor";
import SingleVendorProductSection from "./ProductSection";
import { normalizeProducts } from "./Discovery";
import Image from "@/lib/ui/useable-components/safe-image";

export default function SingleVendorBrowse() {
  const [term, setTerm] = useState("");
  const categories = useQuery(SINGLE_VENDOR_CATEGORIES);
  const [search, result] = useLazyQuery(SINGLE_VENDOR_SEARCH);
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (term.trim().length >= 2) void search({ variables: { search: term.trim(), skip: 0, limit: 20 } });
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [search, term]);
  const loadMore = () => {
    const current = result.data?.searchSingleVendorFoods;
    if (!current?.hasMore || result.loading) return;
    void result.fetchMore({
      variables: { search: term.trim(), skip: current.items?.length ?? 0, limit: 20 },
      updateQuery: (previous, { fetchMoreResult }) => {
        const incoming = fetchMoreResult?.searchSingleVendorFoods;
        if (!incoming) return previous;
        const products = new Map(
          [...(previous.searchSingleVendorFoods?.items ?? []), ...(incoming.items ?? [])]
            .map((item: any) => [item.id, item]),
        );
        return { searchSingleVendorFoods: { ...incoming, items: [...products.values()] } };
      },
    });
  };
  return <div className="pb-12 pt-5">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse products</h1>
    <input value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Search products" className="my-6 w-full rounded-full border border-gray-200 bg-white px-5 py-3 text-gray-900 outline-none focus:border-primary-color focus:ring-2 focus:ring-primary-color/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
    {term ? <><SingleVendorProductSection title={result.loading && !result.data ? "Searching…" : "Search results"} products={normalizeProducts(result.data?.searchSingleVendorFoods?.items)} />{result.data?.searchSingleVendorFoods?.hasMore && <button type="button" disabled={result.loading} onClick={loadMore} className="mx-auto mt-6 block rounded-full bg-primary-color px-6 py-3 font-semibold text-white disabled:opacity-50">{result.loading ? "Loading…" : "Load more"}</button>}</> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{(categories.data?.getRestaurantCategoriesSingleVendor ?? []).map((category: any) => <Link href={`/category/${category.id}`} key={category.id} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">{category.image && <Image src={category.image} alt="" width={320} height={320} className="aspect-square w-full rounded-xl object-cover" />}<p className="mt-3 font-semibold text-gray-900 dark:text-white">{category.name}</p><p className="text-sm text-gray-500">{category.itemCount ?? 0} products</p></Link>)}</div>}
  </div>;
}
