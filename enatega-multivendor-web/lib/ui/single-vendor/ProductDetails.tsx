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

export default function SingleVendorProductDetails({
  foodId,
  categoryId,
}: {
  foodId: string;
  categoryId?: string;
}) {
  const { formatCurrency } = useCurrencyFormatter();
  const productQuery = useQuery(SINGLE_VENDOR_PRODUCT, {
    variables: { foodId, categoryId },
  });
  const similar = useQuery(SINGLE_VENDOR_SIMILAR_PRODUCTS, {
    variables: { foodId, skip: 0, limit: 5 },
  });
  const [selectedVariation, setSelectedVariation] = useState("");
  const [toggleFavorite] = useMutation(SINGLE_VENDOR_TOGGLE_FAVORITE);
  const product = productQuery.data?.getFoodDetails;
  if (productQuery.loading)
    return (
      <div className="h-96 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
    );
  if (!product) return <p className="py-10">Product not found.</p>;
  const variationId = selectedVariation || product.variations?.[0]?.id;
  const variation = product.variations?.find(
    (item: any) => item.id === variationId,
  );
  return (
    <div className="pb-12 pt-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800">
          {product.image && (
            <Image
              src={product.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
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
            {product.variations?.map((variation: any) => (
              <label
                key={variation.id}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-gray-700"
              >
                <span>
                  <input
                    type="radio"
                    name="variation"
                    checked={variationId === variation.id}
                    onChange={() => setSelectedVariation(variation.id)}
                    className="me-3"
                  />
                  {variation.title}
                </span>
                <strong>
                  {formatCurrency(
                    variation.discountedUnitPrice ?? variation.price,
                  )}
                </strong>
              </label>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-700 dark:bg-gray-800">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white">
                Ready to order?
              </p>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Add this option now and adjust the quantity anytime.
              </p>
            </div>
            <CartQuantityController
              variant="details"
              foodId={foodId}
              categoryId={categoryId || product.categoryId}
              variationId={variationId}
              foodTitle={product.title}
              variationTitle={variation?.title}
              image={product.image}
              unitPrice={variation?.discountedUnitPrice ?? variation?.price}
            />
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
