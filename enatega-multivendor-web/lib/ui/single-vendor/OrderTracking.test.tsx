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
                items: [],
              },
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
  useConfig: () => ({ GOOGLE_MAPS_KEY: "browser-map-key" }),
}));

vi.mock(
  "@/lib/ui/screen-components/protected/order-tracking/components/gm-tracking-comp",
  () => ({
    default: ({
      destination,
      riderLocation,
      eta,
      requireBackendRoute,
    }: any) => (
      <div
        data-testid="single-vendor-live-map"
        data-destination={`${destination.lat},${destination.lng}`}
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
    subscribedRawOrder = {
      _id: "order-object-id",
      orderId: "SV-1001",
      orderStatus: "PENDING",
      orderState: "ACCEPTED",
    };
  });

  it("renders store acceptance from the customer order subscription without polling", () => {
    render(<SingleVendorOrderTracking orderId="SV-1001" />);

    expect(screen.getByText("ACCEPTED")).toBeInTheDocument();
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

    expect(screen.getByText("Live delivery tracking")).toBeInTheDocument();
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
});
