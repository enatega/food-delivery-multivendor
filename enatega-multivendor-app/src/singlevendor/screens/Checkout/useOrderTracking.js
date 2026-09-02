import { useContext, useEffect, useState } from 'react'
import { useQuery, useSubscription } from '@apollo/client'
import { useIsFocused } from '@react-navigation/native'
import gql from 'graphql-tag'

import { ORDER_STATUS_ENUM } from '../../../utils/enums'
import { calulateRemainingTime } from '../../../utils/customFunctions'
import UserContext from '../../../context/User'
import { orderStatusChanged, orderTracking, subscriptionOrderTracking } from '../../apollo/subscriptions'
import { getSingleVendorTrackingStatus } from '../../utils/orderTrackingStatus'

const ORDER_SUBSCRIPTION = gql`
  ${orderStatusChanged}
`
const ORDER_TRACKING = gql`${orderTracking}`
const TRACKING_SUBSCRIPTION = gql`${subscriptionOrderTracking}`

const useOrderTracking = ({ orderId, initialOrder }) => {
  const [order, setOrder] = useState(initialOrder)
  const [remainingTime, setRemainingTime] = useState(0)
  const [tracking, setTracking] = useState(null)
  const { profile } = useContext(UserContext)
  const isFocused = useIsFocused()
  const trackingId = order?._id || initialOrder?._id
  const normalizedStatus = getSingleVendorTrackingStatus(order || initialOrder)
  const trackingEnabled = isFocused && Boolean(trackingId) && [
    ORDER_STATUS_ENUM.PICKED,
    'ON_ROUTE'
  ].includes(normalizedStatus)

  const { data: initialTracking } = useQuery(ORDER_TRACKING, {
    variables: { id: trackingId },
    skip: !trackingEnabled,
    fetchPolicy: 'network-only'
  })

  useEffect(() => {
    if (initialTracking?.orderTracking) setTracking(initialTracking.orderTracking)
  }, [initialTracking])

  const { data: trackingUpdate } = useSubscription(TRACKING_SUBSCRIPTION, {
    variables: { id: trackingId },
    skip: !trackingEnabled,
    onError: () => {}
  })

  useEffect(() => {
    const update = trackingUpdate?.subscriptionOrderTracking
    if (update) setTracking(update)
  }, [trackingUpdate])

  const { data: orderUpdate } = useSubscription(ORDER_SUBSCRIPTION, {
    variables: { userId: profile?._id },
    // The WebSocket is authenticated with the customer JWT. Avoid opening a
    // guest socket during session hydration; once the profile is available,
    // Apollo starts the subscription with the mode-scoped token.
    skip: !profile?._id,
    onError: () => {}
  })

  useEffect(() => {
    const updatedOrder = orderUpdate?.orderStatusChanged?.rawOrder
    if (!updatedOrder) return
    if (
      String(updatedOrder._id) !== String(initialOrder?._id) &&
      String(updatedOrder.orderId) !== String(orderId)
    ) return

    setOrder(updatedOrder)
  }, [initialOrder?._id, orderId, orderUpdate])

  // ⏱ ETA calculation
  useEffect(() => {
    if (!order) return

    if ([ORDER_STATUS_ENUM.DELIVERED, ORDER_STATUS_ENUM.CANCELLED, ORDER_STATUS_ENUM.CANCELLEDBYREST].includes(order.orderStatus)) {
      setRemainingTime(0)
      return
    }

    const updateTime = () => {
      const time = calulateRemainingTime(order)
      setRemainingTime(time)
    }

    updateTime()
    const interval = setInterval(updateTime, 5000)

    return () => clearInterval(interval)
  }, [order])

  useEffect(() => {
    if (initialOrder) {
      setOrder((currentOrder) => {
        if (!currentOrder) return initialOrder

        const currentStatus = getSingleVendorTrackingStatus(currentOrder)
        const incomingStatus = getSingleVendorTrackingStatus(initialOrder)
        const statusRank = {
          PENDING: 0,
          ACCEPTED: 1,
          ASSIGNED: 2,
          PICKED: 3,
          ON_ROUTE: 4,
          DELIVERED: 5,
          COMPLETED: 5,
          CANCELLED: 5,
          CANCELLEDBYREST: 5
        }

        return (statusRank[incomingStatus] ?? -1) >= (statusRank[currentStatus] ?? -1)
          ? initialOrder
          : currentOrder
      })
    }
    return () => {}
  }, [initialOrder])

  return {
    order: order
      ? {
          ...order,
          orderStatus: getSingleVendorTrackingStatus(order)
        }
      : order,
    remainingTime,
    tracking
  }
}

export default useOrderTracking
