import { useState, useContext } from 'react'
import { Configuration, Restaurant } from '../context'

export default function useOrders() {
  const [active, setActive] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const { loading, error, data, refetch, networkStatus } = useContext(
    Restaurant.Context
  )
  const configuration = useContext(Configuration.Context)
  const activeOrders =
    data &&
    data.restaurantOrders.filter(order => order.orderStatus === 'PENDING')
      .length
  const processingOrders =
    data &&
    data.restaurantOrders.filter(order =>
      ['ACCEPTED', 'ASSIGNED', 'PICKED'].includes(order.orderStatus)
    ).length
  const deliveredOrders =
    data &&
    data.restaurantOrders.filter(order => order.orderStatus === 'DELIVERED')
      .length

  return {
    loading,
    error,
    data,
    refetch,
    networkStatus,
    activeOrders,
    processingOrders,
    deliveredOrders,
    active,
    setActive,
    showVideo,
    setShowVideo,
    configuration
  }
}
