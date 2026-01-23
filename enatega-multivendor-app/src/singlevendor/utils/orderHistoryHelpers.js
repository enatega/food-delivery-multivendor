import { ORDER_STATUS_ENUM } from '../../utils/enums'

export const formatOrderDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const day = date.getDate()
  const month = months[date.getMonth()]
  const hours = date.getHours()
  const minutes = date.getMinutes()

  const formattedDay = day < 10 ? `0${day}` : day
  const formattedHours = hours < 10 ? `0${hours}` : hours
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

  return `${formattedDay} ${month}, ${formattedHours}:${formattedMinutes}`
}

export const buildOrderHistoryList = ({ orders, currencySymbol, t }) => {
  if (!orders || !Array.isArray(orders)) return []

  const ongoingOrders = []
  const pastOrders = []

  orders.forEach((order) => {
    const isCancelled = order.orderStatus === ORDER_STATUS_ENUM.CANCELLED || order.orderStatus === ORDER_STATUS_ENUM.CANCELLEDBYREST
    const isDelivered = order.orderStatus === ORDER_STATUS_ENUM.DELIVERED || order.orderStatus === ORDER_STATUS_ENUM.COMPLETED

    let section = 'ongoing'
    let statusLabel = 'Ongoing'

    if (isCancelled) {
      section = 'past'
      statusLabel = 'Order Cancelled'
    } else if (isDelivered) {
      section = 'past'
      statusLabel = 'Order Delivered'
    }

    const dateSource = order.deliveredAt || order.completionTime || order.expectedTime || order.orderDate || order.createdAt

    const amount = Number.parseFloat(order.orderAmount || 0)

    const baseItem = {
      id: order._id,
      type: 'item',
      name: order.orderId || order.restaurant?.name,
      date: formatOrderDate(dateSource),
      status: statusLabel,
      price: `${currencySymbol} ${amount.toFixed(2)}`,
      image: order.restaurant?.image ? { uri: order.restaurant.image } : null,
      section
    }

    if (section === 'ongoing') {
      ongoingOrders.push(baseItem)
    } else {
      pastOrders.push(baseItem)
    }
  })

  const items = []

  if (ongoingOrders.length > 0) {
    items.push({
      type: 'header',
      id: 'header-ongoing',
      title: t('Ongoing order') || 'Ongoing order'
    })
    ongoingOrders.forEach((item) => {
      items.push(item)
    })
  }

  if (pastOrders.length > 0) {
    items.push({
      type: 'header',
      id: 'header-past',
      title: t('Past Orders') || 'Past Orders'
    })
    pastOrders.forEach((item) => {
      items.push(item)
    })
  }

  return items
}

export const buildScheduledOrderList = ({ orders, currencySymbol, t }) => {
  if (!orders || !Array.isArray(orders) || orders.length === 0) return []

  const scheduledOrders = []

  orders.forEach((order) => {
    const dateSource = order.expectedTime || order.preparationTime || order.orderDate || order.createdAt || null

    const amount = Number.parseFloat(order.orderAmount || 0)

    const baseItem = {
      id: order._id,
      type: 'item',
      name: order.orderId || order.restaurant?.name,
      date: formatOrderDate(dateSource),
      status: 'Scheduled',
      price: `${currencySymbol} ${amount.toFixed(2)}`,
      image: order.restaurant?.image ? { uri: order.restaurant.image } : null,
      section: 'scheduled'
    }

    scheduledOrders.push(baseItem)
  })

  const items = []

  if (scheduledOrders.length > 0) {
    items.push({
      type: 'header',
      id: 'header-scheduled',
      title: t('Scheduled Orders') || 'Scheduled Orders'
    })
    scheduledOrders.forEach((item) => {
      items.push(item)
    })
  }

  return items
}
