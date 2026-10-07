"use client";

import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import type { ModeProduct } from "@/lib/mode/types";
import Image from "@/lib/ui/useable-components/safe-image";
import useCurrencyFormatter from "@/lib/hooks/useCurrencyFormatter";
import CartQuantityController from "./CartQuantityController";
import {
  getSingleVendorDealLabel,
  getSingleVendorDealPricing,
} from "@/lib/mode/singleVendorPricing";
import { useTranslations } from "next-intl";
import {
  getFirstAvailableVariation,
  isSingleVendorProductOutOfStock,
} from "@/lib/mode/singleVendorStock";

export default function SingleVendorProductCard({
  product,
}: {
  product: ModeProduct;
}) {
  const { formatCurrency } = useCurrencyFormatter();
  const t = useTranslations();
  const variation =
    getFirstAvailableVariation(product.variations) || product.variations?.[0];
  const isOutOfStock = isSingleVendorProductOutOfStock(product);
  const originalPrice = variation?.price;
  const calculated = getSingleVendorDealPricing(originalPrice, variation?.deal);
  const finalPrice = variation?.discountedPrice ?? calculated.finalPrice;
  const dealLabel = getSingleVendorDealLabel(variation?.deal, formatCurrency);
  const hasDeal =
    Boolean(dealLabel) &&
    typeof originalPrice === "number" &&
    finalPrice < originalPrice;
  const href = `/product/${product.id}${product.categoryId ? `?categoryId=${product.categoryId}` : ""}`;
  return (
    <article className="group relative h-full overflow-hidden rounded-[16px] border border-dispatch-line bg-dispatch-surface p-1.5 shadow-[0_4px_16px_rgba(21,25,20,0.035)] transition duration-300 hover:-translate-y-0.5 hover:border-primary-disabled hover:shadow-[0_14px_30px_rgba(21,25,20,0.1)] dark:border-gray-800 dark:bg-gray-900">
      <Link href={href} className="flex h-full flex-col focus-visible:outline-none">
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-[12px] bg-dispatch-map ring-1 ring-inset ring-black/5 dark:bg-gray-800">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              className={`object-cover transition duration-500 ${isOutOfStock ? "grayscale-[35%] opacity-65" : "group-hover:scale-[1.05]"}`}
            />
          ) : (
            <div className="h-full w-full" />
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#151914]/25 to-transparent"
          />
          {hasDeal && !isOutOfStock && (
            <span className="absolute bottom-2 start-2 z-10 inline-flex items-center gap-1 rounded-full bg-primary-color px-2.5 py-1 text-[11px] font-bold leading-none text-dispatch-ink shadow-[0_6px_16px_rgba(90,193,47,0.4)] ring-2 ring-white/70 dark:ring-gray-900/70">
              <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3 fill-current">
                <path d="M8.6 1.2a1 1 0 0 0-.7-.3H2a1 1 0 0 0-1 1v5.9a1 1 0 0 0 .3.7l6.8 6.8a1 1 0 0 0 1.4 0l5.9-5.9a1 1 0 0 0 0-1.4L8.6 1.2ZM4.5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
              </svg>
              {dealLabel}
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute inset-x-2.5 bottom-2.5 z-10 rounded-md bg-dispatch-ink/90 px-2 py-1.5 text-center text-xs font-semibold text-white backdrop-blur-sm">
              {t("out_of_stock_label")}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col px-1.5 pb-1 pt-2.5">
          <h3 className="line-clamp-1 text-sm font-semibold leading-tight tracking-[-0.01em] text-dispatch-ink dark:text-white sm:text-[15px]">
            {product.title}
          </h3>
          <p className="mt-1 line-clamp-2 min-h-[2rem] text-xs leading-4 text-dispatch-muted dark:text-gray-400">
            {product.description}
          </p>
          {typeof originalPrice === "number" && (
            <div className="mt-auto flex items-center justify-between gap-2 pt-3">
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
                <span className="text-base font-bold leading-none tracking-[-0.01em] text-dispatch-ink tabular-nums dark:text-white sm:text-lg">
                  {formatCurrency(finalPrice)}
                </span>
                {hasDeal && (
                  <span className="text-xs leading-none text-dispatch-muted line-through decoration-1 tabular-nums dark:text-gray-400">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
              </div>
              <span
                aria-hidden
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-dispatch-map text-dispatch-muted transition duration-300 group-hover:bg-primary-color group-hover:text-dispatch-ink rtl:-scale-x-100 dark:bg-gray-800 dark:text-gray-300"
              >
                <FiArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" strokeWidth={2.5} />
              </span>
            </div>
          )}
        </div>
      </Link>
      <CartQuantityController
        foodId={product.id}
        categoryId={product.categoryId}
        variationId={variation?.id}
        foodTitle={product.title}
        variationTitle={variation?.title || variation?.name}
        image={product.image}
        unitPrice={finalPrice}
        isOutOfStock={isOutOfStock}
        className="end-3.5 top-3.5"
      />
    </article>
  );
}
