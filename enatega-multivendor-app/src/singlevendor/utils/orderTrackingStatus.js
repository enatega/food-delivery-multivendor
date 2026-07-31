import { ORDER_STATUS_ENUM } from '../../utils/enums'

export const SINGLE_VENDOR_TRACKING_STATUS = {
  ...ORDER_STATUS_ENUM,
  ON_ROUTE: 'ON_ROUTE'
}

export const getSingleVendorTrackingStatus = (order) => {
  if (!order) return undefined

  switch (order.orderState) {
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
      return order.rider
        ? ORDER_STATUS_ENUM.ASSIGNED
        : ORDER_STATUS_ENUM.ACCEPTED
    default:
      break
  }

  if (order.orderStatus === ORDER_STATUS_ENUM.ACCEPTED && order.rider) {
    return ORDER_STATUS_ENUM.ASSIGNED
  }

  return order.orderStatus
}
