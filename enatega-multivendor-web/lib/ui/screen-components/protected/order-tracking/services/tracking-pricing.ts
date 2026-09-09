type OrderVariationPricing = {
  price?: number | string | null;
  discounted?: number | string | null;
};

const toNonNegativeAmount = (value: unknown) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.max(amount, 0) : 0;
};

/**
 * Order snapshots store `discounted: 0` when no variation discount exists.
 * Only a positive price below the regular price represents an actual discount.
 */
export function getOrderVariationPricing(
  variation?: OrderVariationPricing | null,
) {
  const originalUnitPrice = toNonNegativeAmount(variation?.price);
  const candidateDiscount = Number(variation?.discounted);
  const hasDiscount =
    Number.isFinite(candidateDiscount) &&
    candidateDiscount > 0 &&
    candidateDiscount < originalUnitPrice;

  return {
    originalUnitPrice,
    finalUnitPrice: hasDiscount ? candidateDiscount : originalUnitPrice,
    hasDiscount,
  };
}
