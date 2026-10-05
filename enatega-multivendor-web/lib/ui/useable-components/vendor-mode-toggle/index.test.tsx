import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import VendorModeToggle from ".";

const switchMode = vi.fn(async () => true);
const { prefetchSingleVendorDiscovery, routerPrefetch } = vi.hoisted(() => ({
  prefetchSingleVendorDiscovery: vi.fn(async () => undefined),
  routerPrefetch: vi.fn(),
}));
vi.mock("@/lib/mode", () => ({
  APP_MODES: { MULTI: "MULTI", SINGLE: "SINGLE" },
  getModeHomeRoute: (mode: string) => (mode === "SINGLE" ? "/discovery" : "/"),
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
vi.mock("@/lib/ui/single-vendor/prefetchDiscovery", () => ({
  prefetchSingleVendorDiscovery,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ prefetch: routerPrefetch }),
}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({
      delivery_label: "Delivery",
      multi_vendor_label: "Multi Vendor",
      single_vendor_label: "Single Vendor",
    })[key] || key,
}));

describe("VendorModeToggle", () => {
  beforeEach(() => {
    switchMode.mockClear();
    prefetchSingleVendorDiscovery.mockClear();
    routerPrefetch.mockClear();
  });
  afterEach(cleanup);

  it("renders an accessible radio group and switches modes", async () => {
    render(<VendorModeToggle />);
    expect(
      screen.getByRole("radiogroup", { name: "Delivery" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "Single Vendor" }));
    expect(switchMode).toHaveBeenCalledWith("SINGLE");
  });

  it("prefetches single-vendor discovery when Single Vendor is hovered", () => {
    render(<VendorModeToggle />);
    fireEvent.pointerEnter(screen.getByRole("radio", { name: "Single Vendor" }));
    expect(prefetchSingleVendorDiscovery).toHaveBeenCalled();
    expect(routerPrefetch).toHaveBeenCalledWith("/discovery");
  });
});
