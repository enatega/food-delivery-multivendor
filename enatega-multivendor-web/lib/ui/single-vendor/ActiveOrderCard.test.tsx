import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SingleVendorActiveOrderCard from "./ActiveOrderCard";

vi.mock("@apollo/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@apollo/client")>();
  return {
    ...actual,
    useQuery: () => ({
      loading: false,
      error: undefined,
      refetch: vi.fn(),
      data: {
        recentActiveOrder: {
          rawOrder: {
            _id: "6a7c5d99f2adb4e43a340a30",
            orderId: "SV-1042",
            orderStatus: "ACCEPTED",
            orderAmount: 24.5,
            restaurant: { name: "Enatega Market" },
            deliveryAddress: { deliveryAddress: "Main Street" },
            items: [{ _id: "item-1", title: "Apples", quantity: 2 }],
          },
        },
      },
    }),
    useSubscription: () => ({ data: undefined }),
  };
});
vi.mock("@/lib/context/auth/auth.context", () => ({
  useAuth: () => ({ authToken: "customer-token" }),
}));
vi.mock("@/lib/hooks/useUser", () => ({
  default: () => ({ profile: { _id: "user-1" } }),
}));
vi.mock("@/lib/hooks/useCurrencyFormatter", () => ({
  default: () => ({
    formatCurrency: (value: number) => `$${value.toFixed(2)}`,
  }),
}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({
      active_orders_title: "Active Orders",
      item_label: "item",
      items_label: "items",
      loading_orders: "Loading orders",
      something_went_wrong_please_try_again:
        "Something went wrong. Please try again.",
      track_order_button_label: "Track your order",
      try_again_button: "Try Again",
    })[key] || key,
}));

describe("SingleVendorActiveOrderCard", () => {
  it("shows the latest order and links with its public orderId", () => {
    render(<SingleVendorActiveOrderCard />);

    const trackingLink = screen.getByRole("link", {
      name: "Track your order",
    });
    expect(trackingLink).toHaveAttribute("href", "/order/SV-1042/tracking");
    expect(screen.getByText("Enatega Market")).toBeInTheDocument();
    expect(screen.getByText("$24.50")).toBeInTheDocument();
    expect(trackingLink).not.toHaveAttribute(
      "href",
      expect.stringContaining("6a7c5d99f2adb4e43a340a30"),
    );
  });
});
