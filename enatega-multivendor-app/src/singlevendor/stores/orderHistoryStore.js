import { create } from 'zustand'

const getOrderKey = (order, fallbackIndex = 0) => {
  if (!order || typeof order !== 'object') return `invalid-${fallbackIndex}`
  return order._id || order.id || order.orderId || `idx-${fallbackIndex}`
}

const mergeOrders = (previousOrders = [], nextOrders = [], options = {}) => {
  if (!Array.isArray(nextOrders) || nextOrders.length === 0) {
    return options.replace ? [] : previousOrders
  }

  if (options.replace) {
    const seen = new Set()
    return nextOrders.filter((order, index) => {
      const key = getOrderKey(order, index)
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  const merged = [...previousOrders]
  const existingKeys = new Set(
    previousOrders.map((order, index) => getOrderKey(order, index))
  )
  let hasNewOrders = false

  nextOrders.forEach((order, index) => {
    const key = getOrderKey(order, index)
    if (!existingKeys.has(key)) {
      existingKeys.add(key)
      merged.push(order)
      hasNewOrders = true
    }
  })

  return hasNewOrders ? merged : previousOrders
}

const useOrderHistoryStore = create((set) => ({
  scheduledOrdersCount: null,
  activeOrdersCount: null,
  pastOrdersCount: null,
  scheduledOrders: [],
  activeOrders: [],
  pastOrders: [],
  hasLoadedScheduledOrders: false,
  hasLoadedActiveOrders: false,
  hasLoadedPastOrders: false,

  setScheduledOrdersCount: (count) => set({ scheduledOrdersCount: count }),
  setActiveOrdersCount: (count) => set({ activeOrdersCount: count }),
  setPastOrdersCount: (count) => set({ pastOrdersCount: count }),
  setActiveOrders: (orders, options = {}) =>
    set((state) => {
      console.log("Setting active orders with:", orders)
      const safeOrders = Array.isArray(orders) ? orders : []
      const mergedOrders = mergeOrders(state.activeOrders, safeOrders, options)
      const isUnchanged = mergedOrders === state.activeOrders
      if (isUnchanged && state.hasLoadedActiveOrders) return state
      return {
        activeOrders: mergedOrders,
        activeOrdersCount: mergedOrders.length,
        hasLoadedActiveOrders: true
      }
    }),
  setPastOrders: (orders, options = {}) =>
    set((state) => {
      const safeOrders = Array.isArray(orders) ? orders : []
      const mergedOrders = mergeOrders(state.pastOrders, safeOrders, options)
      const isUnchanged = mergedOrders === state.pastOrders
      if (isUnchanged && state.hasLoadedPastOrders) return state
      return {
        pastOrders: mergedOrders,
        pastOrdersCount: mergedOrders.length,
        hasLoadedPastOrders: true
      }
    }),
  setScheduledOrders: (orders, options = {}) =>
    set((state) => {
      const safeOrders = Array.isArray(orders) ? orders : []
      const mergedOrders = mergeOrders(state.scheduledOrders, safeOrders, options)
      const isUnchanged = mergedOrders === state.scheduledOrders
      if (isUnchanged && state.hasLoadedScheduledOrders) return state
      return {
        scheduledOrders: mergedOrders,
        scheduledOrdersCount: mergedOrders.length,
        hasLoadedScheduledOrders: true
      }
    }),

  resetOrderHistoryCounts: () =>
    set({
      scheduledOrdersCount: null,
      activeOrdersCount: null,
      pastOrdersCount: null,
      scheduledOrders: [],
      activeOrders: [],
      pastOrders: [],
      hasLoadedScheduledOrders: false,
      hasLoadedActiveOrders: false,
      hasLoadedPastOrders: false
    })
}))

export default useOrderHistoryStore
