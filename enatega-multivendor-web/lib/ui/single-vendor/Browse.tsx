"use client";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SINGLE_VENDOR_CATEGORIES, SINGLE_VENDOR_SEARCH } from "@/lib/api/graphql/single-vendor";
import SingleVendorProductSection from "./ProductSection";
import { normalizeProducts } from "./Discovery";
import Image from "@/lib/ui/useable-components/safe-image";
import { useTranslations } from "next-intl";

export default function SingleVendorBrowse() {
  const t = useTranslations();
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
  return <div className="pb-12 pt-8">
    <h1 className="font-dispatch text-4xl font-bold uppercase leading-none tracking-tight text-dispatch-ink dark:text-white">{t("Footer.products")}</h1>
    <input value={term} onChange={(event) => setTerm(event.target.value)} placeholder={t("search_for_food_items_placeholder")} className="my-6 min-h-12 w-full border border-dispatch-line bg-dispatch-surface px-4 py-3 text-dispatch-ink outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-focus dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
    {term ? <><SingleVendorProductSection title={t("Footer.products")} products={normalizeProducts(result.data?.searchSingleVendorFoods?.items)} />{result.data?.searchSingleVendorFoods?.hasMore && <button type="button" disabled={result.loading} onClick={loadMore} className="mx-auto mt-6 block min-h-11 bg-primary-color px-6 py-3 font-semibold text-dispatch-ink transition hover:bg-primary-hover disabled:opacity-50">{t("more_button")}</button>}</> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{(categories.data?.getRestaurantCategoriesSingleVendor ?? []).map((category: any) => <Link href={`/category/${category.id}`} key={category.id} className="group border border-dispatch-line bg-dispatch-surface p-4 transition hover:-translate-y-0.5 hover:border-primary-color hover:shadow-dispatch dark:border-gray-800 dark:bg-gray-900">{category.image && <Image src={category.image} alt="" width={320} height={320} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.02]" />}<p className="mt-3 font-dispatch text-lg font-bold uppercase leading-tight text-dispatch-ink dark:text-white">{category.name}</p><p className="text-sm text-dispatch-muted">{category.itemCount ?? 0} {t("items_label")}</p></Link>)}</div>}
  </div>;
}
