import { useContext, useEffect, useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import gql from 'graphql-tag'

import { ORDER_STATUS_ENUM } from '../../../utils/enums'
import { calulateRemainingTime } from '../../../utils/customFunctions'
import UserContext from '../../../context/User'
import { orderStatusChanged } from '../../apollo/subscriptions'

const ORDER_SUBSCRIPTION = gql`
  ${orderStatusChanged}
`

const useOrderTracking = ({ orderId, initialOrder }) => {
  console.log("initial order use order tracking",initialOrder)
  const client = useApolloClient()

  const [order, setOrder] = useState(initialOrder)
  const [remainingTime, setRemainingTime] = useState(0)
  const { profile } = useContext(UserContext)
  // 🔔 Real-time subscription

  console.log()
  useSubscription(ORDER_SUBSCRIPTION, {
    variables: { userId: profile?._id },
    onData: ({ data }) => {
      console.log('order subscription data:', data)
      const updatedOrder = data?.data?.orderStatusChanged?.rawOrder
      if (!updatedOrder) return

      setOrder(updatedOrder)
    },
    onError: (err) => {
      console.log('order subscription error', err)
    }
  })

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
      console.log("initial order changed",initialOrder)
      setOrder(initialOrder)
    }
    return () => {}
  }, [initialOrder])

  return {
    order,
    remainingTime
  }
}

export default useOrderTracking
