import { isLiveDeliveryTrackingStatus } from "@/lib/ui/screen-components/protected/order-tracking/services/tracking-status";

export const SINGLE_VENDOR_TRACKING_STAGES = [
  "PENDING",
  "ACCEPTED",
  "ASSIGNED",
  "PICKED",
  "ON_ROUTE",
  "DELIVERED",
] as const;

const STATUS_RANK: Record<string, number> = {
  PENDING: 0,
  ACCEPTED: 1,
  ASSIGNED: 2,
  PICKED: 3,
  ON_ROUTE: 4,
  DELIVERED: 5,
  COMPLETED: 5,
};

interface TrackableOrder {
  orderStatus?: string | null;
  orderState?: string | null;
  rider?: unknown;
}

const statusFromOrderState = (order: TrackableOrder) => {
  switch (order.orderState) {
    case "COMPLETED":
      return "DELIVERED";
    case "CANCELLED":
    case "RETURNED":
      return "CANCELLED";
    case "PICKED_UP":
      return "PICKED";
    case "ON_ROUTE":
      return "ON_ROUTE";
    case "ACCEPTED":
    case "PICKING":
    case "READY_TO_PACK":
    case "PACKING":
    case "READY_FOR_PICKUP":
      return order.rider ? "ASSIGNED" : "ACCEPTED";
    default:
      return undefined;
  }
};

export const getSingleVendorTrackingStatus = (
  order?: TrackableOrder | null,
) => {
  if (!order) return undefined;

  const stateStatus = statusFromOrderState(order);
  const legacyStatus =
    order.orderStatus === "COMPLETED"
      ? "DELIVERED"
      : order.orderStatus === "ACCEPTED" && order.rider
        ? "ASSIGNED"
        : order.orderStatus || undefined;

  if (
    stateStatus === "CANCELLED" ||
    legacyStatus === "CANCELLED" ||
    legacyStatus === "CANCELLEDBYREST"
  ) {
    return "CANCELLED";
  }

  if (!stateStatus) return legacyStatus;
  if (!legacyStatus) return stateStatus;

  return (STATUS_RANK[legacyStatus] ?? -1) > (STATUS_RANK[stateStatus] ?? -1)
    ? legacyStatus
    : stateStatus;
};

export const isSingleVendorLiveTrackingStatus = isLiveDeliveryTrackingStatus;
