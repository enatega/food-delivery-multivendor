import { describe, expect, it } from "vitest";

import { formatCurrencyValue } from "./useCurrencyFormatter";

describe("formatCurrencyValue", () => {
  it("prefers the configured currency symbol", () => {
    expect(formatCurrencyValue(12.5, "€", "EUR")).toBe("€12.50");
  });

  it("falls back to the currency code with readable spacing", () => {
    expect(formatCurrencyValue("9", "", "USD")).toBe("USD 9.00");
  });

  it("places discounts before the currency label", () => {
    expect(formatCurrencyValue(-4.25, "$", "USD")).toBe("-$4.25");
  });

  it("does not display invalid monetary values", () => {
    expect(formatCurrencyValue(undefined, "$", "USD")).toBe("—");
  });
});
