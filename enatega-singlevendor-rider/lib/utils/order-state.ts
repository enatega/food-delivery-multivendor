import { RIDER_SERVER_MODES, RiderServerMode } from "@/lib/mode/rider-mode";
import { IOrder } from "@/lib/utils/interfaces/order.interface";

export const isNewOrderForMode = (
  order: Pick<IOrder, "orderState" | "orderStatus" | "rider" | "isPickedUp">,
  mode: RiderServerMode,
) => {
  const isReady =
    mode === RIDER_SERVER_MODES.SINGLE
      ? order.orderState === "ACCEPTED" ||
        order.orderState === "READY_FOR_PICKUP" ||
        (!order.orderState && order.orderStatus === "ACCEPTED")
      : order.orderStatus === "ACCEPTED";

  return isReady && !order.rider && !order.isPickedUp;
};

export const isProcessingOrderForMode = (
  order: Pick<IOrder, "orderState" | "orderStatus" | "rider" | "isPickedUp">,
  mode: RiderServerMode,
) => {
  if (mode === RIDER_SERVER_MODES.MULTI) {
    return (
      ["PICKED", "ASSIGNED"].includes(order.orderStatus) && !order.isPickedUp
    );
  }

  if (!order.rider) return false;

  return order.orderState
    ? ["ACCEPTED", "READY_FOR_PICKUP", "PICKED_UP", "ON_ROUTE"].includes(
        order.orderState,
      )
    : ["ASSIGNED", "PICKED"].includes(order.orderStatus);
};

export const canPickupOrderForMode = (
  order: Pick<IOrder, "orderState" | "orderStatus" | "rider">,
  mode: RiderServerMode,
) => {
  if (mode === RIDER_SERVER_MODES.MULTI) {
    return order.orderStatus === "ASSIGNED";
  }

  if (!order.rider) return false;
  return order.orderState
    ? ["ACCEPTED", "READY_FOR_PICKUP"].includes(order.orderState)
    : order.orderStatus === "ASSIGNED";
};

export const canDeliverOrderForMode = (
  order: Pick<IOrder, "orderState" | "orderStatus" | "rider">,
  mode: RiderServerMode,
) => {
  if (mode === RIDER_SERVER_MODES.MULTI) {
    return order.orderStatus === "PICKED";
  }

  if (!order.rider) return false;
  return order.orderState
    ? ["PICKED_UP", "ON_ROUTE"].includes(order.orderState)
    : order.orderStatus === "PICKED";
};
