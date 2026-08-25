export const isLiveDeliveryTrackingStatus = (status?: string | null) =>
  status === "PICKED" || status === "ON_ROUTE";
