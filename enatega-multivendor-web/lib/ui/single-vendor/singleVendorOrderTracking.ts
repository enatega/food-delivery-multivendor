import { getOrderVariationPricing } from "@/lib/ui/screen-components/protected/order-tracking/services/tracking-pricing";

const toAmount = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
};

export function getGeoJsonCoordinate(
  location?: {
    coordinates?: Array<number | string | null> | null;
  } | null,
) {
  const longitudeValue = location?.coordinates?.[0];
  const latitudeValue = location?.coordinates?.[1];
  if (longitudeValue === null || longitudeValue === undefined) return null;
  if (latitudeValue === null || latitudeValue === undefined) return null;

  const longitude = Number(longitudeValue);
  const latitude = Number(latitudeValue);

  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { lat: latitude, lng: longitude }
    : null;
}

export function normalizeSingleVendorTrackingOrder(
  rawOrder: Record<string, any>,
  summaryData: Record<string, any> | null | undefined,
  status: string,
  eta: Record<string, any> | null | undefined,
) {
  const sourceItems = summaryData?.items?.length
    ? summaryData.items
    : (rawOrder.items ?? []);
  let items = sourceItems.map((item: Record<string, any>) => ({
    ...item,
    image:
      item.image || item.foodImage || item.variationImage || rawOrder.image,
    title: item.foodTitle || item.title,
    quantity: item.foodQuantity ?? item.quantity ?? 0,
    variation: item.variation ?? {
      _id: item.variationId,
      title: item.variationTitle,
      price:
        toAmount(item.variationTotal) /
        Math.max(toAmount(item.foodQuantity ?? item.quantity), 1),
      discounted: null,
    },
    addons: item.addons ?? [],
  }));

  const expectedSubtotal = Number(summaryData?.itemsSubTotal);
  if (Number.isFinite(expectedSubtotal)) {
    const regularSubtotal = items.reduce(
      (total: number, item: Record<string, any>) =>
        total +
        toAmount(item.variation?.price) * toAmount(item.quantity) +
        getItemAddonsTotal(item),
      0,
    );
    const displayedSubtotal = items.reduce(
      (total: number, item: Record<string, any>) =>
        total +
        getOrderVariationPricing(item.variation).finalUnitPrice *
          toAmount(item.quantity) +
        getItemAddonsTotal(item),
      0,
    );

    // Legacy orders copied the catalog's `discounted` field even when no deal
    // was applied. The charged order subtotal is authoritative in that case.
    if (
      amountsMatch(expectedSubtotal, regularSubtotal) &&
      !amountsMatch(expectedSubtotal, displayedSubtotal)
    ) {
      items = items.map((item: Record<string, any>) => ({
        ...item,
        variation: { ...item.variation, discounted: 0 },
      }));
    } else if (
      items.length === 1 &&
      !amountsMatch(expectedSubtotal, displayedSubtotal)
    ) {
      const [item] = items;
      const quantity = Math.max(toAmount(item.quantity), 1);
      const addonsTotal = getItemAddonsTotal(item);
      const chargedUnitPrice = Math.max(
        (expectedSubtotal - addonsTotal) / quantity,
        0,
      );
      const originalUnitPrice = toAmount(item.variation?.price);

      if (chargedUnitPrice < originalUnitPrice) {
        items = [
          {
            ...item,
            variation: {
              ...item.variation,
              discounted: Number(chargedUnitPrice.toFixed(2)),
            },
          },
        ];
      }
    }
  }

  return {
    ...rawOrder,
    ...summaryData,
    _id: rawOrder._id,
    orderId: rawOrder.orderId,
    orderStatus: status,
    restaurant: rawOrder.restaurant,
    rider: { ...rawOrder.rider, ...summaryData?.rider },
    deliveryAddress: summaryData?.deliveryAddress ?? rawOrder.deliveryAddress,
    items,
    eta,
  };
}

function getItemAddonsTotal(item: Record<string, any>) {
  const addonsUnitTotal = (item.addons ?? []).reduce(
    (total: number, addon: Record<string, any>) =>
      total +
      (addon.options ?? []).reduce(
        (optionsTotal: number, option: Record<string, any>) =>
          optionsTotal + toAmount(option.price),
        0,
      ),
    0,
  );
  return addonsUnitTotal * toAmount(item.quantity);
}

function amountsMatch(left: number, right: number) {
  return Math.abs(left - right) < 0.005;
}

export function getSingleVendorTrackingAmounts(order: Record<string, any>) {
  const calculatedDiscountedSubtotal = (order.items ?? []).reduce(
    (total: number, item: Record<string, any>) => {
      const { finalUnitPrice: unitPrice } = getOrderVariationPricing(
        item.variation,
      );
      return (
        total +
        toAmount(unitPrice) * toAmount(item.quantity) +
        getItemAddonsTotal(item)
      );
    },
    0,
  );
  const calculatedOriginalSubtotal = (order.items ?? []).reduce(
    (total: number, item: Record<string, any>) =>
      total +
      getOrderVariationPricing(item.variation).originalUnitPrice *
        toAmount(item.quantity) +
      getItemAddonsTotal(item),
    0,
  );
  const chargedSubtotal =
    order.itemsSubTotal === null || order.itemsSubTotal === undefined
      ? calculatedDiscountedSubtotal
      : toAmount(order.itemsSubTotal);
  const dealDiscount = Math.max(
    calculatedOriginalSubtotal - chargedSubtotal,
    0,
  );
  const detailedDiscount =
    toAmount(order.deliveryDiscount) + toAmount(order.couponDiscount);

  return {
    subtotal: chargedSubtotal + dealDiscount,
    dealDiscount: Number(dealDiscount.toFixed(2)),
    deliveryCharge: toAmount(
      order.deliverChargesAmount ?? order.deliveryCharges,
    ),
    tax: toAmount(order.taxationAmount),
    tip: toAmount(order.tipping),
    minimumOrderFee: toAmount(order.minimumOrderFee),
    priorityDeliveryFee: toAmount(order.priorityDeliveryFees),
    discount:
      detailedDiscount > 0 ? detailedDiscount : toAmount(order.discountAmount),
    creditsApplied: toAmount(order.creditsApplied),
    total: toAmount(order.orderAmount),
  };
}
