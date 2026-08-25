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
  const items = sourceItems.map((item: Record<string, any>) => ({
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

export function getSingleVendorTrackingAmounts(order: Record<string, any>) {
  const calculatedSubtotal = (order.items ?? []).reduce(
    (total: number, item: Record<string, any>) => {
      const unitPrice =
        item.variation?.discounted ?? item.variation?.price ?? 0;
      return total + toAmount(unitPrice) * toAmount(item.quantity);
    },
    0,
  );
  const detailedDiscount =
    toAmount(order.deliveryDiscount) + toAmount(order.couponDiscount);

  return {
    subtotal:
      order.itemsSubTotal === null || order.itemsSubTotal === undefined
        ? calculatedSubtotal
        : toAmount(order.itemsSubTotal),
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
