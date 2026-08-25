import { describe, expect, it } from "vitest";

import {
  getSingleVendorCartUnitPrice,
  getSingleVendorDealPricing,
} from "./singleVendorPricing";

describe("single-vendor deal pricing", () => {
  it("applies the app's uppercase percentage deal rule", () => {
    expect(
      getSingleVendorDealPricing(25, {
        discountType: "PERCENTAGE",
        discountValue: 25,
        isActive: true,
      }),
    ).toEqual({ finalPrice: 18.75, discountAmount: 6.25 });
  });

  it("applies fixed deals and never returns a negative price", () => {
    expect(
      getSingleVendorDealPricing(6.25, {
        discountType: "FIXED",
        discountValue: 10,
        isActive: true,
      }),
    ).toEqual({ finalPrice: 0, discountAmount: 6.25 });
  });

  it("ignores inactive deals", () => {
    expect(
      getSingleVendorDealPricing(12, {
        discountType: "PERCENTAGE",
        discountValue: 50,
        isActive: false,
      }).finalPrice,
    ).toBe(12);
  });

  it("uses the server discounted unit price for cart totals", () => {
    expect(
      getSingleVendorCartUnitPrice({
        unitPrice: 25,
        discountedUnitPrice: 18.75,
      }),
    ).toBe(18.75);
    expect(getSingleVendorCartUnitPrice({ unitPrice: 25 })).toBe(25);
  });
});
