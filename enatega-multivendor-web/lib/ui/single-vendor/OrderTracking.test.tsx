import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SingleVendorOrderTracking from "./OrderTracking";

const queryOptions: Array<Record<string, unknown>> = [];
const subscriptionOptions: Array<{
  operation: string;
  options: Record<string, any>;
}> = [];
let subscribedRawOrder: Record<string, unknown> = {};
let trackingPayload: Record<string, unknown> | undefined;
let summaryPayload: Record<string, unknown> = {};

vi.mock("@apollo/client", async () => {
  const actual =
    await vi.importActual<typeof import("@apollo/client")>("@apollo/client");
  const operationName = (document: any) =>
    document.definitions?.find((definition: any) => definition.name)?.name
      ?.value;

  return {
    ...actual,
    useQuery: (document: any, options: Record<string, unknown>) => {
      queryOptions.push(options);
      if (operationName(document) === "SingleVendorOrderDetailsPage") {
        return {
          loading: false,
          data: {
            orderDetailsPage: {
              rawOrder: {
                _id: "order-object-id",
                orderId: "SV-1001",
                orderStatus: "PENDING",
                orderState: "PENDING",
                orderAmount: 24,
                taxationAmount: 0,
                tipping: 0,
                deliveryCharges: 0,
                paymentMethod: "COD",
                restaurant: {
                  _id: "store-id",
                  name: "Enatega Store",
                  location: { coordinates: [74.3, 31.5] },
                },
                deliveryAddress: {
                  location: { coordinates: [74.32, 31.52] },
                },
                items: [],
              },
              data: summaryPayload,
            },
          },
        };
      }
      if (operationName(document) === "SingleVendorOrderTracking") {
        return {
          loading: false,
          data: trackingPayload
            ? { orderTracking: trackingPayload }
            : undefined,
        };
      }
      return { loading: false, data: undefined };
    },
    useSubscription: (document: any, options: Record<string, any>) => {
      const operation = operationName(document);
      subscriptionOptions.push({ operation, options });
      if (operation === "SingleVendorOrderStatusChanged") {
        return {
          data: {
            orderStatusChanged: {
              rawOrder: {
                ...subscribedRawOrder,
              },
            },
          },
        };
      }
      return { data: undefined };
    },
  };
});

vi.mock("@/lib/hooks/useUser", () => ({
  default: () => ({ profile: { _id: "customer-id" } }),
}));

vi.mock("@/lib/hooks/useCurrencyFormatter", () => ({
  default: () => ({ formatCurrency: (value: unknown) => `$${value}` }),
}));

vi.mock("@/lib/context/configuration/configuration.context", () => ({
  useConfig: () => ({
    GOOGLE_MAPS_KEY: "browser-map-key",
    CURRENCY_SYMBOL: "$",
  }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({
      estimated_Delivery_time: "Estimated Delivery Time",
      PendingRestaurant: "We’re confirming your order with the store.",
      AcceptedRestaurantSimple: "The store is preparing your order.",
      Assigned: "A rider has been assigned.",
      Picked: "Your order is on the way.",
      live_updates_enabled_label: "Live updates enabled",
      need_help_with_order_text: "Need help with your order?",
      get_help_link_text: "Get Help",
      order_details_subheading: "Order",
      order_details_heading: "Order Details",
      order_details_no_instructions_text: "No special instructions",
      order_details_instruction_label: "Instructions",
      order_details_summary_label: "Summary",
      order_details_items_label: "items",
      order_details_subtotal_label: "Subtotal",
      order_details_tax_label: "Tax",
      order_details_tip_label: "Tip",
      Addons_label: "Addons",
      order_details_delivery_charge_label: "Delivery Charge",
      order_details_minimum_order_fee_label: "Low order fee",
      order_details_priority_delivery_fee_label: "Priority delivery fee",
      discount_label: "Discount",
      order_details_credits_applied_label: "Credits applied",
      order_details_total_label: "Total",
      order_details_paid_with_label: "Paid with",
      order_details_cash_on_delivery_label: "Cash on delivery",
      order_status_cancelled_label: "Cancelled",
    })[key] || key,
}));

vi.mock(
  "@/lib/ui/screen-components/protected/order-tracking/components/gm-tracking-comp",
  () => ({
    default: ({
      destination,
      origin,
      riderLocation,
      eta,
      requireBackendRoute,
    }: any) => (
      <div
        data-testid="single-vendor-live-map"
        data-destination={`${destination.lat},${destination.lng}`}
        data-origin={`${origin?.lat},${origin?.lng}`}
        data-rider={`${riderLocation?.latitude},${riderLocation?.longitude}`}
        data-polyline={eta?.encodedPolyline}
        data-backend-route={String(requireBackendRoute)}
      />
    ),
  }),
);

describe("Single Vendor order tracking", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    queryOptions.length = 0;
    subscriptionOptions.length = 0;
    trackingPayload = undefined;
    summaryPayload = {};
    subscribedRawOrder = {
      _id: "order-object-id",
      orderId: "SV-1001",
      orderStatus: "PENDING",
      orderState: "ACCEPTED",
    };
  });

  it("renders store acceptance from the customer order subscription without polling", () => {
    render(<SingleVendorOrderTracking orderId="SV-1001" />);

    expect(screen.getByText("Accepted")).toBeInTheDocument();
    expect(queryOptions.every((options) => !("pollInterval" in options))).toBe(
      true,
    );
    expect(subscriptionOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          operation: "SingleVendorOrderStatusChanged",
          options: expect.objectContaining({
            variables: { userId: "customer-id" },
            skip: false,
          }),
        }),
      ]),
    );
  });

  it("hides the map before rider pickup", () => {
    render(<SingleVendorOrderTracking orderId="SV-1001" />);

    expect(
      screen.queryByTestId("single-vendor-live-map"),
    ).not.toBeInTheDocument();
    expect(subscriptionOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          operation: "SingleVendorOrderTrackingUpdated",
          options: expect.objectContaining({ skip: true }),
        }),
      ]),
    );
  });

  it("shows the live map when a delivery order is picked up", () => {
    subscribedRawOrder = {
      _id: "order-object-id",
      orderId: "SV-1001",
      orderStatus: "PICKED",
      orderState: "PICKED_UP",
      deliveryType: "DELIVERY",
      deliveryAddress: {
        location: { coordinates: [74.32, 31.52] },
      },
    };
    trackingPayload = {
      riderLocation: {
        latitude: 31.5,
        longitude: 74.3,
        recordedAt: new Date().toISOString(),
      },
      eta: {
        source: "GOOGLE",
        encodedPolyline: "_p~iF~ps|U_ulLnnqC_mqNvxq`@",
        destination: { latitude: 31.52, longitude: 74.32 },
        windowStartAt: "2030-01-01T12:00:00.000Z",
        windowEndAt: "2030-01-01T12:10:00.000Z",
      },
    };

    render(<SingleVendorOrderTracking orderId="SV-1001" />);

    expect(screen.getByText("Picked")).toBeInTheDocument();
    expect(screen.getByTestId("single-vendor-live-map")).toHaveAttribute(
      "data-destination",
      "31.52,74.32",
    );
    expect(screen.getByTestId("single-vendor-live-map")).toHaveAttribute(
      "data-rider",
      "31.5,74.3",
    );
    expect(screen.getByTestId("single-vendor-live-map")).toHaveAttribute(
      "data-polyline",
      "_p~iF~ps|U_ulLnnqC_mqNvxq`@",
    );
    expect(screen.getByTestId("single-vendor-live-map")).toHaveAttribute(
      "data-backend-route",
      "true",
    );
    expect(subscriptionOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          operation: "SingleVendorOrderTrackingUpdated",
          options: expect.objectContaining({ skip: false }),
        }),
      ]),
    );
  });

  it("renders tax, fees, discounts, credits, and the authoritative total", () => {
    summaryPayload = {
      orderAmount: 105,
      itemsSubTotal: 100,
      taxationAmount: 4,
      tipping: 3,
      deliverChargesAmount: 8,
      minimumOrderFee: 1,
      priorityDeliveryFees: 2,
      deliveryDiscount: 2,
      couponDiscount: 5,
      creditsApplied: 6,
    };

    render(<SingleVendorOrderTracking orderId="SV-1001" />);

    expect(screen.getByText("Tax")).toBeInTheDocument();
    expect(screen.getByText("Low order fee")).toBeInTheDocument();
    expect(screen.getByText("Priority delivery fee")).toBeInTheDocument();
    expect(screen.getByText("Discount")).toBeInTheDocument();
    expect(screen.getByText("Credits applied")).toBeInTheDocument();
    expect(screen.getAllByText("$105.00")).not.toHaveLength(0);
    expect(screen.getByText("-$7.00")).toBeInTheDocument();
    expect(screen.getByText("-$6.00")).toBeInTheDocument();
  });
});
