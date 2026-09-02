"use client";

import Link from "next/link";
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
    <article className="group relative h-full overflow-hidden rounded-xl border border-dispatch-line bg-dispatch-surface transition-shadow hover:shadow-[0_12px_30px_rgba(21,25,20,0.09)] dark:border-gray-800 dark:bg-gray-900">
      <Link href={href} className="block h-full focus-visible:outline-none">
        <div className="relative aspect-[16/9] overflow-hidden bg-dispatch-map dark:bg-gray-800">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              className={`object-cover transition duration-300 ${isOutOfStock ? "grayscale-[35%] opacity-65" : "group-hover:scale-[1.03]"}`}
            />
          ) : (
            <div className="h-full w-full" />
          )}
          {hasDeal && (
            <span className="absolute start-2.5 top-2.5 z-10 rounded-md bg-primary-color px-2 py-1 text-xs font-bold leading-none text-dispatch-ink shadow-sm">
              {dealLabel}
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute inset-x-2.5 bottom-2.5 z-10 rounded-md bg-dispatch-ink/90 px-2 py-1.5 text-center text-xs font-semibold text-white backdrop-blur-sm">
              {t("out_of_stock_label")}
            </span>
          )}
        </div>
        <div className="p-2.5">
          <h3 className="line-clamp-1 text-sm font-medium leading-tight text-dispatch-ink dark:text-white sm:text-base">
            {product.title}
          </h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-dispatch-muted dark:text-gray-400">
              {product.description}
            </p>
          )}
          {typeof originalPrice === "number" && (
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
              <span className="font-semibold text-primary-dark">
                {formatCurrency(finalPrice)}
              </span>
              {hasDeal && (
                <span className="text-xs text-dispatch-muted line-through decoration-1 dark:text-gray-400">
                  {formatCurrency(originalPrice)}
                </span>
              )}
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
      />
    </article>
  );
}
