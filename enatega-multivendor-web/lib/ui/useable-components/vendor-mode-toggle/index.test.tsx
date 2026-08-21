import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import VendorModeToggle from ".";

const switchMode = vi.fn(async () => true);
vi.mock("@/lib/mode", () => ({
  APP_MODES: { MULTI: "MULTI", SINGLE: "SINGLE" },
  useAppMode: () => ({
    mode: "MULTI",
    isModeToggleEnabled: true,
    singleVendorAvailable: true,
    isModeSwitchBlocked: false,
    isSwitchingMode: false,
    switchMode,
  }),
}));
vi.mock("@/lib/hooks/useUser", () => ({
  default: () => ({ cartCount: 0, orders: [] }),
}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({
      delivery_label: "Delivery",
      tab_restaurants: "Restaurants",
      tab_store: "Store",
    })[key] || key,
}));

describe("VendorModeToggle", () => {
  beforeEach(() => switchMode.mockClear());

  it("renders an accessible radio group and switches modes", async () => {
    render(<VendorModeToggle />);
    expect(
      screen.getByRole("radiogroup", { name: "Delivery" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "Store" }));
    expect(switchMode).toHaveBeenCalledWith("SINGLE");
  });
});
