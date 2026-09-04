export interface SingleVendorCartAddonSelection {
  _id: string;
  options: Array<{
    _id: string;
    title?: string;
  }>;
}

export interface SingleVendorCartAddonInput {
  _id: string;
  options: string[];
}

export function serializeSingleVendorCartAddons(
  addons: SingleVendorCartAddonSelection[] = [],
): SingleVendorCartAddonInput[] {
  return addons.map((addon) => ({
    _id: addon._id,
    options: addon.options.map((option) => option._id),
  }));
}

function getAddonSelectionKey(addons: SingleVendorCartAddonSelection[] = []) {
  return addons
    .flatMap((addon) =>
      addon.options.map((option) => `${addon._id}:${option._id}`),
    )
    .sort()
    .join("|");
}

export function isSingleVendorCartConfiguration(
  item: {
    _id: string;
    variation: { _id: string };
    addons?: SingleVendorCartAddonSelection[];
  },
  foodId: string,
  variationId: string,
  addons: SingleVendorCartAddonSelection[] = [],
) {
  return (
    item._id === foodId &&
    item.variation._id === variationId &&
    getAddonSelectionKey(item.addons) === getAddonSelectionKey(addons)
  );
}

interface SingleVendorCartPricingSnapshot {
  quantity?: number | string | null;
  unitPrice?: number | string | null;
  actualUnitPrice?: number | string | null;
  discountedUnitPrice?: number | string | null;
  actualItemTotal?: number | string | null;
  discountedItemTotal?: number | string | null;
  itemTotal?: number | string | null;
}

function optionalAmount(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.max(amount, 0) : null;
}

export function getSingleVendorCartDisplayPricing(
  variation: SingleVendorCartPricingSnapshot,
) {
  const quantity = optionalAmount(variation.quantity) ?? 0;
  const actualUnitPrice =
    optionalAmount(variation.actualUnitPrice) ??
    optionalAmount(variation.unitPrice) ??
    0;
  const discountedUnitPrice =
    optionalAmount(variation.discountedUnitPrice) ?? actualUnitPrice;
  const actualItemTotal = optionalAmount(variation.actualItemTotal);
  const discountedItemTotal =
    optionalAmount(variation.discountedItemTotal) ??
    optionalAmount(variation.itemTotal);

  return {
    actualUnitPrice:
      quantity > 0 && actualItemTotal !== null
        ? actualItemTotal / quantity
        : actualUnitPrice,
    discountedUnitPrice:
      quantity > 0 && discountedItemTotal !== null
        ? discountedItemTotal / quantity
        : discountedUnitPrice,
  };
}
