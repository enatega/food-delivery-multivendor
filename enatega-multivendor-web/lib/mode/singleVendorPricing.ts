export interface SingleVendorDeal {
  discountType?: string | null;
  discountValue?: number | string | null;
  isActive?: boolean | null;
}

const roundCurrency = (value: number) => Number(value.toFixed(2));

export function getSingleVendorDealPricing(
  priceInput: number | string | null | undefined,
  deal?: SingleVendorDeal | null,
) {
  const parsedPrice = Number(priceInput);
  const price = Number.isFinite(parsedPrice) ? Math.max(parsedPrice, 0) : 0;

  if (!deal || deal.isActive === false) {
    return { finalPrice: roundCurrency(price), discountAmount: 0 };
  }

  const parsedDiscount = Number(deal.discountValue);
  const discountValue = Number.isFinite(parsedDiscount)
    ? Math.max(parsedDiscount, 0)
    : 0;
  const discountType = deal.discountType?.toUpperCase();

  const discountAmount =
    discountType === "PERCENTAGE"
      ? (price * discountValue) / 100
      : discountType === "FIXED"
        ? discountValue
        : 0;

  const appliedDiscount = Math.min(discountAmount, price);

  return {
    finalPrice: roundCurrency(price - appliedDiscount),
    discountAmount: roundCurrency(appliedDiscount),
  };
}

export function getSingleVendorDealLabel(
  deal: SingleVendorDeal | null | undefined,
  formatFixedAmount: (value: number) => string,
  offLabel = "OFF",
) {
  if (!deal || deal.isActive === false) return null;

  const discountValue = Number(deal.discountValue);
  if (!Number.isFinite(discountValue) || discountValue <= 0) return null;

  const type = deal.discountType?.toUpperCase();
  if (type === "PERCENTAGE") return `${discountValue}% ${offLabel}`;
  if (type === "FIXED")
    return `${formatFixedAmount(discountValue)} ${offLabel}`;
  return null;
}

export function getSingleVendorCartUnitPrice(variation: {
  discountedUnitPrice?: number | string | null;
  unitPrice?: number | string | null;
}) {
  const preferredPrice =
    variation.discountedUnitPrice ?? variation.unitPrice ?? 0;
  const parsedPrice = Number(preferredPrice);
  return Number.isFinite(parsedPrice) ? Math.max(parsedPrice, 0) : 0;
}
