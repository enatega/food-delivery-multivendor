import { describe, expect, it } from "vitest";

import {
  getSingleVendorCartDisplayPricing,
  isSingleVendorCartConfiguration,
  serializeSingleVendorCartAddons,
} from "./singleVendorCart";

describe("single-vendor cart payload", () => {
  it("keeps an empty add-on selection valid", () => {
    expect(serializeSingleVendorCartAddons()).toEqual([]);
  });

  it("serializes selected add-on option references as GraphQL strings", () => {
    expect(
      serializeSingleVendorCartAddons([
        {
          _id: "frosting-addon",
          options: [
            { _id: "chocolate-option", title: "Chocolate" },
            { _id: "vanilla-option", title: "Vanilla" },
          ],
        },
      ]),
    ).toEqual([
      {
        _id: "frosting-addon",
        options: ["chocolate-option", "vanilla-option"],
      },
    ]);
  });

  it("preserves multiple selected add-on groups", () => {
    expect(
      serializeSingleVendorCartAddons([
        {
          _id: "frosting-addon",
          options: [{ _id: "chocolate-option" }],
        },
        {
          _id: "message-addon",
          options: [{ _id: "birthday-option" }],
        },
      ]),
    ).toEqual([
      { _id: "frosting-addon", options: ["chocolate-option"] },
      { _id: "message-addon", options: ["birthday-option"] },
    ]);
  });
});

describe("single-vendor cart configuration identity", () => {
  const item = {
    _id: "cake",
    variation: { _id: "three-pound" },
    addons: [
      {
        _id: "frosting",
        options: [{ _id: "chocolate" }],
      },
    ],
  };

  it("matches the same option and add-on configuration", () => {
    expect(
      isSingleVendorCartConfiguration(item, "cake", "three-pound", [
        {
          _id: "frosting",
          options: [{ _id: "chocolate" }],
        },
      ]),
    ).toBe(true);
  });

  it("keeps different add-on and variation configurations separate", () => {
    expect(
      isSingleVendorCartConfiguration(item, "cake", "three-pound", [
        { _id: "frosting", options: [{ _id: "vanilla" }] },
      ]),
    ).toBe(false);
    expect(
      isSingleVendorCartConfiguration(item, "cake", "five-pound", [
        { _id: "frosting", options: [{ _id: "chocolate" }] },
      ]),
    ).toBe(false);
  });
});

describe("single-vendor cart pricing", () => {
  it("uses the server-authoritative item total including add-ons", () => {
    expect(
      getSingleVendorCartDisplayPricing({
        quantity: 1,
        actualUnitPrice: 2999,
        discountedUnitPrice: 2999,
        actualItemTotal: 3009,
        discountedItemTotal: 3009,
      }),
    ).toEqual({ actualUnitPrice: 3009, discountedUnitPrice: 3009 });
  });

  it("derives a unit display price without multiplying quantity twice", () => {
    expect(
      getSingleVendorCartDisplayPricing({
        quantity: 3,
        actualUnitPrice: 2999,
        discountedUnitPrice: 2999,
        actualItemTotal: 9027,
        discountedItemTotal: 9027,
      }),
    ).toEqual({ actualUnitPrice: 3009, discountedUnitPrice: 3009 });
  });
});
