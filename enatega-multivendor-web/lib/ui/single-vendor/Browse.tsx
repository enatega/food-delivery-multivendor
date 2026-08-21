"use client";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  SINGLE_VENDOR_CATEGORIES,
  SINGLE_VENDOR_SEARCH,
} from "@/lib/api/graphql/single-vendor";
import SingleVendorProductSection from "./ProductSection";
import { SingleVendorProductSectionSkeleton } from "./ProductSection";
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
      if (term.trim().length >= 2)
        void search({ variables: { search: term.trim(), skip: 0, limit: 20 } });
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [search, term]);
  const loadMore = () => {
    const current = result.data?.searchSingleVendorFoods;
    if (!current?.hasMore || result.loading) return;
    void result.fetchMore({
      variables: {
        search: term.trim(),
        skip: current.items?.length ?? 0,
        limit: 20,
      },
      updateQuery: (previous, { fetchMoreResult }) => {
        const incoming = fetchMoreResult?.searchSingleVendorFoods;
        if (!incoming) return previous;
        const products = new Map(
          [
            ...(previous.searchSingleVendorFoods?.items ?? []),
            ...(incoming.items ?? []),
          ].map((item: any) => [item.id, item]),
        );
        return {
          searchSingleVendorFoods: {
            ...incoming,
            items: [...products.values()],
          },
        };
      },
    });
  };
  const searchProducts = normalizeProducts(
    result.data?.searchSingleVendorFoods?.items,
  );
  const categoryItems =
    categories.data?.getRestaurantCategoriesSingleVendor ?? [];

  return (
    <div className="pb-12">
      <header className="border-b border-dispatch-line pb-5 sm:pb-6 dark:border-gray-800">
        <h1 className="font-dispatch text-2xl font-semibold leading-tight tracking-[-0.025em] text-dispatch-ink sm:text-3xl dark:text-white">
          {t("Footer.products")}
        </h1>
        <div className="relative mt-5 max-w-3xl">
          <i
            className="pi pi-search pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-sm text-dispatch-muted"
            aria-hidden
          />
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder={t("search_for_food_items_placeholder")}
            className="min-h-12 w-full rounded-xl border border-dispatch-line bg-dispatch-surface py-3 pe-4 ps-11 text-sm text-dispatch-ink outline-none transition placeholder:text-dispatch-muted focus:border-primary-color focus:ring-2 focus:ring-primary-focus dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </header>

      {term.trim().length >= 2 ? (
        <>
          {result.loading && !result.data ? (
            <SingleVendorProductSectionSkeleton />
          ) : searchProducts.length > 0 ? (
            <SingleVendorProductSection
              title={t("Footer.products")}
              products={searchProducts}
            />
          ) : (
            <div className="flex min-h-48 items-center justify-center py-10 text-center text-sm text-dispatch-muted">
              {t("no_items_found")}
            </div>
          )}
          {result.data?.searchSingleVendorFoods?.hasMore && (
            <button
              type="button"
              disabled={result.loading}
              onClick={loadMore}
              className="mx-auto mt-6 block min-h-11 rounded-xl bg-primary-color px-6 py-3 text-sm font-semibold text-dispatch-ink transition-colors hover:bg-primary-hover focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("more_button")}
            </button>
          )}
        </>
      ) : categories.loading ? (
        <div
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6"
          aria-busy="true"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl bg-dispatch-surface p-2 dark:bg-gray-900"
            >
              <div className="aspect-square rounded-lg bg-dispatch-map dark:bg-gray-800" />
              <div className="mt-3 h-4 w-2/3 rounded bg-dispatch-line" />
              <div className="mt-2 h-3 w-1/3 rounded bg-dispatch-line" />
            </div>
          ))}
        </div>
      ) : categoryItems.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6">
          {categoryItems.map((category: any) => (
            <Link
              href={`/category/${category.id}`}
              key={category.id}
              className="group overflow-hidden rounded-xl border border-dispatch-line bg-dispatch-surface p-2 transition-shadow hover:shadow-[0_12px_30px_rgba(21,25,20,0.09)] focus-visible:outline-none dark:border-gray-800 dark:bg-gray-900"
            >
              {category.image && (
                <div className="overflow-hidden rounded-lg bg-dispatch-map">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={320}
                    height={320}
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                  />
                </div>
              )}
              <p className="mt-3 line-clamp-1 px-1 text-[15px] font-medium leading-tight text-dispatch-ink dark:text-white">
                {category.name}
              </p>
              <p className="px-1 pb-1 pt-1 text-xs text-dispatch-muted">
                {category.itemCount ?? 0} {t("items_label")}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex min-h-48 items-center justify-center py-10 text-center text-sm text-dispatch-muted">
          {t("no_items_found")}
        </div>
      )}
    </div>
  );
}
