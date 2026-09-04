import { describe, expect, it } from "vitest";

import {
  getGeoJsonCoordinate,
  getSingleVendorTrackingAmounts,
  normalizeSingleVendorTrackingOrder,
} from "./singleVendorOrderTracking";

describe("single-vendor order tracking data", () => {
  it("normalizes customer and store GeoJSON coordinates", () => {
    expect(getGeoJsonCoordinate({ coordinates: [74.32, 31.52] })).toEqual({
      lat: 31.52,
      lng: 74.32,
    });
    expect(getGeoJsonCoordinate({ coordinates: [null, null] })).toBeNull();
  });

  it("uses the mobile-app summary payload as the authoritative totals source", () => {
    expect(
      getSingleVendorTrackingAmounts({
        itemsSubTotal: 100,
        deliveryCharges: 6,
        deliverChargesAmount: 8,
        deliveryDiscount: 2,
        couponDiscount: 5,
        taxationAmount: 4,
        tipping: 3,
        minimumOrderFee: 1,
        priorityDeliveryFees: 2,
        creditsApplied: 6,
        orderAmount: 105,
      }),
    ).toEqual({
      subtotal: 100,
      dealDiscount: 0,
      deliveryCharge: 8,
      tax: 4,
      tip: 3,
      minimumOrderFee: 1,
      priorityDeliveryFee: 2,
      discount: 7,
      creditsApplied: 6,
      total: 105,
    });
  });

  it("derives deal savings from item prices when summary totals are absent", () => {
    expect(
      getSingleVendorTrackingAmounts({
        items: [
          {
            quantity: 2,
            variation: { price: 12, discounted: 9 },
          },
        ],
        discountAmount: 3,
      }),
    ).toMatchObject({ subtotal: 24, dealDiscount: 6, discount: 3 });
  });

  it("falls back to the regular item price when discounted is the zero sentinel", () => {
    expect(
      getSingleVendorTrackingAmounts({
        items: [
          {
            quantity: 2,
            variation: { price: 12, discounted: 0 },
          },
        ],
      }),
    ).toMatchObject({ subtotal: 24 });
  });

  it("shows the original subtotal and deal savings separately", () => {
    expect(
      getSingleVendorTrackingAmounts({
        itemsSubTotal: 8.45,
        items: [
          {
            quantity: 1,
            variation: { price: 9.49, discounted: 8.45 },
          },
        ],
      }),
    ).toMatchObject({ subtotal: 9.49, dealDiscount: 1.04 });
  });

  it("merges summary items without losing live raw-order locations", () => {
    const normalized = normalizeSingleVendorTrackingOrder(
      {
        _id: "order-id",
        orderId: "SV-1",
        restaurant: { location: { coordinates: [74.3, 31.5] } },
        deliveryAddress: { location: { coordinates: [74.4, 31.6] } },
        items: [],
      },
      {
        items: [
          {
            _id: "item-id",
            foodTitle: "Deal meal",
            foodImage: "/meal.webp",
            foodQuantity: 2,
            variation: { title: "Regular", price: 10, discounted: 8 },
          },
        ],
      },
      "ACCEPTED",
      { phase: "PREPARING" },
    );

    expect(normalized.restaurant.location.coordinates).toEqual([74.3, 31.5]);
    expect(normalized.deliveryAddress.location.coordinates).toEqual([
      74.4, 31.6,
    ]);
    expect(normalized.items[0]).toMatchObject({
      title: "Deal meal",
      image: "/meal.webp",
      quantity: 2,
    });
    expect(normalized.orderStatus).toBe("ACCEPTED");
  });

  it("ignores a legacy catalog discount when the order was charged regular price", () => {
    const normalized = normalizeSingleVendorTrackingOrder(
      {
        _id: "order-id",
        orderId: "SV-2",
        items: [],
      },
      {
        itemsSubTotal: 8.99,
        items: [
          {
            foodTitle: "Classic Angus Burger",
            foodQuantity: 1,
            variation: {
              title: "Single",
              price: 8.99,
              discounted: 7.99,
            },
          },
        ],
      },
      "PENDING",
      null,
    );

    expect(normalized.items[0].variation).toMatchObject({
      price: 8.99,
      discounted: 0,
    });
  });

  it("recovers the charged deal price for a legacy single-item order", () => {
    const normalized = normalizeSingleVendorTrackingOrder(
      {
        _id: "order-id",
        orderId: "SV-3",
        items: [],
      },
      {
        itemsSubTotal: 8.45,
        items: [
          {
            foodTitle: "Smash Chili Burger",
            foodQuantity: 1,
            variation: {
              title: "Regular",
              price: 9.49,
              discounted: 0,
            },
          },
        ],
      },
      "PENDING",
      null,
    );

    expect(normalized.items[0].variation).toMatchObject({
      price: 9.49,
      discounted: 8.45,
    });
  });
});
