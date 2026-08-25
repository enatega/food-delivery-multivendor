import { describe, expect, it } from "vitest";

import {
  getFirstAvailableVariation,
  isSingleVendorProductOutOfStock,
} from "./singleVendorStock";
import type { ModeProduct } from "./types";

const variations: ModeProduct["variations"] = [
  { id: "sold-out", price: 12, isOutOfStock: true },
  { id: "available", price: 14, isOutOfStock: false },
];

describe("single-vendor stock state", () => {
  it("selects the first available variation", () => {
    expect(getFirstAvailableVariation(variations)?.id).toBe("available");
  });

  it("marks a product unavailable when its product flag is set", () => {
    expect(
      isSingleVendorProductOutOfStock({
        isOutOfStock: true,
        variations,
      }),
    ).toBe(true);
  });

  it("marks a product unavailable when all variations are unavailable", () => {
    expect(
      isSingleVendorProductOutOfStock({
        variations: variations.map((variation) => ({
          ...variation,
          isOutOfStock: true,
        })),
      }),
    ).toBe(true);
  });

  it("treats a product without a purchasable variation as unavailable", () => {
    expect(isSingleVendorProductOutOfStock({ variations: [] })).toBe(true);
  });
});
