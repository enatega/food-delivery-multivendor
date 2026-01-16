import { useEffect, useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import gql from 'graphql-tag'


import { orderStatusChanged } from '../../../apollo/subscriptions'
import { ORDER_STATUS_ENUM } from '../../../utils/enums'
import { calulateRemainingTime } from '../../../utils/customFunctions'


const ORDER_SUBSCRIPTION = gql`
  ${orderStatusChanged}
`

const useOrderTracking = ({ orderId, initialOrder }) => {
  const client = useApolloClient()

  const [order, setOrder] = useState(initialOrder)
  const [remainingTime, setRemainingTime] = useState(0)

  // 🔔 Real-time subscription
  useSubscription(ORDER_SUBSCRIPTION, {
    variables: { orderId },
    onData: ({ data }) => {
        console.log("order subscription data:",data)
      const updatedOrder = data?.data?.orderStatusChanged?.order
      if (!updatedOrder) return

      setOrder(updatedOrder)
    }
  })

  // ⏱ ETA calculation
  useEffect(() => {
    if (!order) return

    if (
      [ORDER_STATUS_ENUM.DELIVERED,
       ORDER_STATUS_ENUM.CANCELLED,
       ORDER_STATUS_ENUM.CANCELLEDBYREST].includes(order.orderStatus)
    ) {
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

  return {
    order,
    remainingTime
  }
}

export default useOrderTracking
