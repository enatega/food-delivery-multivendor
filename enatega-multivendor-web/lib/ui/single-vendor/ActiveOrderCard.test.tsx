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

describe("SingleVendorActiveOrderCard", () => {
  it("shows the latest order and links with its public orderId", () => {
    render(<SingleVendorActiveOrderCard />);

    const trackingLink = screen.getByRole("link", {
      name: "Track active order SV-1042",
    });
    expect(trackingLink).toHaveAttribute("href", "/order/SV-1042/tracking");
    expect(
      screen.getByText("Your order is being prepared"),
    ).toBeInTheDocument();
    expect(screen.getByText("$24.50")).toBeInTheDocument();
    expect(trackingLink).not.toHaveAttribute(
      "href",
      expect.stringContaining("6a7c5d99f2adb4e43a340a30"),
    );
  });
});
