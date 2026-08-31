"use client";
import { useMutation, useQuery } from "@apollo/client";
import {
  SINGLE_VENDOR_PRODUCT,
  SINGLE_VENDOR_SIMILAR_PRODUCTS,
  SINGLE_VENDOR_TOGGLE_FAVORITE,
} from "@/lib/api/graphql/single-vendor";
import { useState } from "react";
import SingleVendorProductSection from "./ProductSection";
import { normalizeProducts } from "./Discovery";
import Image from "@/lib/ui/useable-components/safe-image";
import useCurrencyFormatter from "@/lib/hooks/useCurrencyFormatter";
import CartQuantityController from "./CartQuantityController";
import {
  getSingleVendorDealLabel,
  getSingleVendorDealPricing,
} from "@/lib/mode/singleVendorPricing";
import { useTranslations } from "next-intl";
import { getFirstAvailableVariation } from "@/lib/mode/singleVendorStock";

export default function SingleVendorProductDetails({
  foodId,
  categoryId,
}: {
  foodId: string;
  categoryId?: string;
}) {
  const { formatCurrency } = useCurrencyFormatter();
  const t = useTranslations();
  const productQuery = useQuery(SINGLE_VENDOR_PRODUCT, {
    variables: { foodId, categoryId },
  });
  const similar = useQuery(SINGLE_VENDOR_SIMILAR_PRODUCTS, {
    variables: { foodId, skip: 0, limit: 5 },
  });
  const [selectedVariation, setSelectedVariation] = useState("");
  const [selectedAddonOptions, setSelectedAddonOptions] = useState<Record<string, string[]>>({});
  const [toggleFavorite] = useMutation(SINGLE_VENDOR_TOGGLE_FAVORITE);
  const product = productQuery.data?.getFoodDetails;
  if (productQuery.loading)
    return <div className="skeleton-surface h-96 animate-pulse rounded-2xl" />;
  if (!product) return <p className="py-10">Product not found.</p>;
  const defaultVariation =
    getFirstAvailableVariation(product.variations) || product.variations?.[0];
  const variationId = selectedVariation || defaultVariation?.id;
  const variation = product.variations?.find(
    (item: any) => item.id === variationId,
  );
  const selectedPricing = getSingleVendorDealPricing(
    variation?.price,
    variation?.deal,
  );
  const selectedFinalPrice =
    variation?.discountedUnitPrice ?? selectedPricing.finalPrice;
  const selectedDealLabel = getSingleVendorDealLabel(
    variation?.deal,
    formatCurrency,
  );
  const selectedHasDeal =
    Boolean(selectedDealLabel) &&
    Number(selectedFinalPrice) < Number(variation?.price);
  const selectedIsOutOfStock = Boolean(
    product.isOutOfStock || variation?.isOutOfStock,
  );
  const addonGroups = variation?.addons ?? [];
  const addonTotal = addonGroups.reduce(
    (sum: number, addon: any) =>
      sum +
      (addon.options ?? [])
        .filter((option: any) => selectedAddonOptions[addon.id]?.includes(option.id))
        .reduce((optionSum: number, option: any) => optionSum + Number(option.price || 0), 0),
    0,
  );
  const addonsAreValid = addonGroups.every((addon: any) => {
    const count = selectedAddonOptions[addon.id]?.length ?? 0;
    return count >= Number(addon.quantityMinimum || 0) &&
      count <= Number(addon.quantityMaximum || Number.POSITIVE_INFINITY);
  });
  const selectedAddons = addonGroups
    .map((addon: any) => ({
      _id: addon.id,
      options: (selectedAddonOptions[addon.id] ?? []).map((_id) => ({ _id })),
    }))
    .filter((addon: any) => addon.options.length > 0);

  const toggleAddonOption = (addon: any, optionId: string) => {
    setSelectedAddonOptions((current) => {
      const selected = current[addon.id] ?? [];
      const maximum = Number(addon.quantityMaximum || addon.options?.length || 1);
      if (maximum === 1) return { ...current, [addon.id]: [optionId] };
      if (selected.includes(optionId)) {
        return { ...current, [addon.id]: selected.filter((id) => id !== optionId) };
      }
      if (selected.length >= maximum) return current;
      return { ...current, [addon.id]: [...selected, optionId] };
    });
  };
  return (
    <div className="pb-12 pt-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800">
          {product.image && (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          )}
          {selectedHasDeal && (
            <span className="absolute start-4 top-4 rounded-lg bg-primary-color px-3 py-2 text-xs font-bold text-dispatch-ink shadow-sm">
              {selectedDealLabel}
            </span>
          )}
          {selectedIsOutOfStock && (
            <span className="absolute inset-x-4 bottom-4 rounded-lg bg-dispatch-ink/90 px-3 py-2 text-center text-sm font-semibold text-white backdrop-blur-sm">
              {t("out_of_stock_label")}
            </span>
          )}
        </div>
        <div>
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.title}
            </h1>
            <button
              aria-label="Toggle favorite"
              onClick={() => void toggleFavorite({ variables: { id: foodId } })}
              className="text-2xl text-primary-color"
            >
              ♡
            </button>
          </div>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            {product.description}
          </p>
          <div className="mt-6 space-y-3">
            {product.variations?.map((variation: any) => {
              const pricing = getSingleVendorDealPricing(
                variation.price,
                variation.deal,
              );
              const finalPrice =
                variation.discountedUnitPrice ?? pricing.finalPrice;
              const hasDeal = Number(finalPrice) < Number(variation.price);
              const isOutOfStock = Boolean(
                product.isOutOfStock || variation.isOutOfStock,
              );

              return (
                <label
                  key={variation.id}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 ${isOutOfStock ? "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-400" : "border-gray-200 dark:border-gray-700"}`}
                >
                  <span className="min-w-0">
                    <input
                      type="radio"
                      name="variation"
                      checked={variationId === variation.id}
                      onChange={() => {
                        setSelectedVariation(variation.id);
                        setSelectedAddonOptions({});
                      }}
                      className="me-3"
                    />
                    {variation.title}
                    {isOutOfStock && (
                      <span className="ms-2 text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                        {t("out_of_stock_label")}
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 items-baseline gap-2">
                    <strong className={hasDeal ? "text-primary-dark" : ""}>
                      {formatCurrency(finalPrice)}
                    </strong>
                    {hasDeal && (
                      <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                        {formatCurrency(variation.price)}
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
          {addonGroups.length > 0 && (
            <div className="mt-6 space-y-4">
              {addonGroups.map((addon: any) => {
                const minimum = Number(addon.quantityMinimum || 0);
                const maximum = Number(addon.quantityMaximum || addon.options?.length || 1);
                return (
                  <fieldset key={addon.id} className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                    <legend className="px-2 font-semibold text-gray-900 dark:text-white">
                      {addon.title}{' '}
                      <span className="text-xs font-normal text-gray-500">
                        {minimum > 0 ? `Select ${minimum}` : 'Optional'}
                        {maximum > 1 ? ` · up to ${maximum}` : ''}
                      </span>
                    </legend>
                    {addon.description && <p className="mb-3 text-sm text-gray-500">{addon.description}</p>}
                    <div className="space-y-2">
                      {(addon.options ?? []).map((option: any) => {
                        const checked = selectedAddonOptions[addon.id]?.includes(option.id) ?? false;
                        return (
                          <label key={option.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <span className="flex items-center gap-3">
                              <input
                                type={maximum === 1 ? 'radio' : 'checkbox'}
                                name={`addon-${addon.id}`}
                                checked={checked}
                                onChange={() => toggleAddonOption(addon, option.id)}
                                className="accent-primary-color"
                              />
                              <span>{option.title}</span>
                            </span>
                            <span className="text-sm text-gray-500">+{formatCurrency(Number(option.price || 0))}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </div>
          )}
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-700 dark:bg-gray-800">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white">
                {selectedIsOutOfStock
                  ? t("out_of_stock_label")
                  : "Ready to order?"}
              </p>
              {!selectedIsOutOfStock && (
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  {addonsAreValid
                    ? `${formatCurrency(Number(selectedFinalPrice) + addonTotal)} per item`
                    : 'Select the required options to continue.'}
                </p>
              )}
            </div>
            {addonsAreValid ? (
              <CartQuantityController
                variant="details"
                foodId={foodId}
                categoryId={categoryId || product.categoryId}
                variationId={variationId}
                foodTitle={product.title}
                variationTitle={variation?.title}
                image={product.image}
                unitPrice={Number(selectedFinalPrice) + addonTotal}
                addons={selectedAddons}
                isOutOfStock={selectedIsOutOfStock}
              />
            ) : (
              <button type="button" disabled className="h-14 min-w-[190px] rounded-2xl bg-gray-200 px-5 font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                Select required options
              </button>
            )}
          </div>
          {product.ingredients && (
            <p className="mt-8 text-sm text-gray-500">
              <strong>Ingredients:</strong> {product.ingredients}
            </p>
          )}
        </div>
      </div>
      <SingleVendorProductSection
        title="You may also like"
        products={normalizeProducts(similar.data?.getSimilarFoods?.items)}
      />
    </div>
  );
}
