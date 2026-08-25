import { describe, expect, it } from "vitest";

import { isLiveDeliveryTrackingStatus } from "./tracking-status";

describe("live delivery tracking status", () => {
  it.each(["PENDING", "ACCEPTED", "ASSIGNED", undefined])(
    "hides the map for %s",
    (status) => {
      expect(isLiveDeliveryTrackingStatus(status)).toBe(false);
    },
  );

  it.each(["PICKED", "ON_ROUTE"])("shows the map for %s", (status) => {
    expect(isLiveDeliveryTrackingStatus(status)).toBe(true);
  });
});
