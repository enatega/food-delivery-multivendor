import { ORDER_STATUS_ENUM } from '../../utils/enums'

export const SINGLE_VENDOR_TRACKING_STATUS = {
  ...ORDER_STATUS_ENUM,
  ON_ROUTE: 'ON_ROUTE'
}

const TRACKING_STATUS_RANK = {
  [ORDER_STATUS_ENUM.PENDING]: 0,
  [ORDER_STATUS_ENUM.ACCEPTED]: 1,
  [ORDER_STATUS_ENUM.ASSIGNED]: 2,
  [ORDER_STATUS_ENUM.PICKED]: 3,
  [SINGLE_VENDOR_TRACKING_STATUS.ON_ROUTE]: 4,
  [ORDER_STATUS_ENUM.DELIVERED]: 5,
  [ORDER_STATUS_ENUM.COMPLETED]: 5
}

const getStatusFromOrderState = (order) => {
  switch (order?.orderState) {
    case 'COMPLETED':
      return ORDER_STATUS_ENUM.DELIVERED
    case 'CANCELLED':
    case 'RETURNED':
      return ORDER_STATUS_ENUM.CANCELLED
    case 'PICKED_UP':
      return ORDER_STATUS_ENUM.PICKED
    case 'ON_ROUTE':
      return SINGLE_VENDOR_TRACKING_STATUS.ON_ROUTE
    case 'ACCEPTED':
    case 'PICKING':
    case 'READY_TO_PACK':
    case 'PACKING':
    case 'READY_FOR_PICKUP':
      return order?.rider
        ? ORDER_STATUS_ENUM.ASSIGNED
        : ORDER_STATUS_ENUM.ACCEPTED
    default:
      return undefined
  }
}

export const getSingleVendorTrackingStatus = (order) => {
  if (!order) return undefined

  const stateStatus = getStatusFromOrderState(order)
  const legacyStatus = order.orderStatus

  if (
    stateStatus === ORDER_STATUS_ENUM.CANCELLED ||
    legacyStatus === ORDER_STATUS_ENUM.CANCELLED ||
    legacyStatus === ORDER_STATUS_ENUM.CANCELLEDBYREST
  ) {
    return ORDER_STATUS_ENUM.CANCELLED
  }

  const normalizedLegacyStatus = legacyStatus === ORDER_STATUS_ENUM.COMPLETED
    ? ORDER_STATUS_ENUM.DELIVERED
    : legacyStatus === ORDER_STATUS_ENUM.ACCEPTED && order.rider
      ? ORDER_STATUS_ENUM.ASSIGNED
      : legacyStatus

  if (!stateStatus) return normalizedLegacyStatus
  if (!normalizedLegacyStatus) return stateStatus

  return (TRACKING_STATUS_RANK[normalizedLegacyStatus] ?? -1) >
    (TRACKING_STATUS_RANK[stateStatus] ?? -1)
    ? normalizedLegacyStatus
    : stateStatus
}

export const getSingleVendorFulfillmentType = (order) => {
  if (order?.deliveryType === 'PICKUP') return 'PICKUP'
  if (order?.deliveryType === 'DELIVERY') return 'DELIVERY'

  return order?.isPickedUp ? 'PICKUP' : 'DELIVERY'
}

export const isSingleVendorPickupOrder = (order) => {
  return getSingleVendorFulfillmentType(order) === 'PICKUP'
}
