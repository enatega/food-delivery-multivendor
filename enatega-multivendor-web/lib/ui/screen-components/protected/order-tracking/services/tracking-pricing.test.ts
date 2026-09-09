import { describe, expect, it } from "vitest";

import { getOrderVariationPricing } from "./tracking-pricing";

describe("order tracking variation pricing", () => {
  it("treats a zero discounted value as no discount", () => {
    expect(getOrderVariationPricing({ price: 25, discounted: 0 })).toEqual({
      originalUnitPrice: 25,
      finalUnitPrice: 25,
      hasDiscount: false,
    });
  });

  it("uses a positive discounted price below the regular price", () => {
    expect(getOrderVariationPricing({ price: 25, discounted: 20 })).toEqual({
      originalUnitPrice: 25,
      finalUnitPrice: 20,
      hasDiscount: true,
    });
  });

  it("falls back to the regular price for invalid discount values", () => {
    expect(getOrderVariationPricing({ price: "25", discounted: null })).toEqual(
      {
        originalUnitPrice: 25,
        finalUnitPrice: 25,
        hasDiscount: false,
      },
    );
  });
});
