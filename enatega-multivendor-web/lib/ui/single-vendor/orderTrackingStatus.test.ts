import { describe, expect, it } from "vitest";
import {
  getSingleVendorTrackingStatus,
  isSingleVendorLiveTrackingStatus,
} from "./orderTrackingStatus";

describe("Single Vendor tracking status", () => {
  it("reflects store acceptance from the new order state", () => {
    expect(
      getSingleVendorTrackingStatus({
        orderStatus: "PENDING",
        orderState: "ACCEPTED",
      }),
    ).toBe("ACCEPTED");
  });

  it("uses assigned when an accepted order has a rider", () => {
    expect(
      getSingleVendorTrackingStatus({
        orderStatus: "ACCEPTED",
        orderState: "ACCEPTED",
        rider: { id: "rider" },
      }),
    ).toBe("ASSIGNED");
  });

  it("keeps the furthest progressed status", () => {
    expect(
      getSingleVendorTrackingStatus({
        orderStatus: "PICKED",
        orderState: "ACCEPTED",
      }),
    ).toBe("PICKED");
  });

  it("enables rider tracking only once the order is in transit", () => {
    expect(isSingleVendorLiveTrackingStatus("ACCEPTED")).toBe(false);
    expect(isSingleVendorLiveTrackingStatus("PICKED")).toBe(true);
    expect(isSingleVendorLiveTrackingStatus("ON_ROUTE")).toBe(true);
  });
});
