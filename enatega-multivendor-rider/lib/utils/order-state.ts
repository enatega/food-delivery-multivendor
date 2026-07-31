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
