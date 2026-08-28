import type { ModeProduct } from "./types";

type SingleVendorVariation = ModeProduct["variations"][number];

export function isVariationOutOfStock(
  variation?: Pick<SingleVendorVariation, "isOutOfStock"> | null,
) {
  return Boolean(variation?.isOutOfStock);
}

export function getFirstAvailableVariation(
  variations?: ModeProduct["variations"] | null,
) {
  return variations?.find((variation) => !isVariationOutOfStock(variation));
}

export function isSingleVendorProductOutOfStock(
  product: Pick<ModeProduct, "isOutOfStock" | "variations">,
) {
  if (product.isOutOfStock) return true;
  if (!product.variations?.length) return true;

  return !getFirstAvailableVariation(product.variations);
}
