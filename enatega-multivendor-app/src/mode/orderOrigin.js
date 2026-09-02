import AsyncStorage from '@react-native-async-storage/async-storage'

import { isAppMode } from './constants'

const ORIGINS_KEY = '@enatega/known-order-origins'
const PENDING_KEY = '@enatega/pending-order-navigation'
const MAX_SAVED_ORDERS = 250

const normalizeOrderId = value => {
  if (value === null || value === undefined) return null
  const normalized = String(value).trim()
  return normalized || null
}

const readOrigins = async() => {
  try {
    return JSON.parse(await AsyncStorage.getItem(ORIGINS_KEY)) || {}
  } catch {
    return {}
  }
}

export const recordOrderOrigin = async(order, mode) => {
  if (!isAppMode(mode)) return

  const ids = [
    normalizeOrderId(order?._id),
    normalizeOrderId(order?.orderId)
  ].filter(Boolean)
  if (!ids.length) return

  const origins = await readOrigins()
  const timestamp = Date.now()
  ids.forEach(id => {
    origins[id] = { mode, timestamp }
  })

  const trimmed = Object.fromEntries(
    Object.entries(origins)
      .sort(([, a], [, b]) => (b?.timestamp || 0) - (a?.timestamp || 0))
      .slice(0, MAX_SAVED_ORDERS)
  )
  await AsyncStorage.setItem(ORIGINS_KEY, JSON.stringify(trimmed))
}

export const getOrderOrigin = async orderId => {
  const id = normalizeOrderId(orderId)
  if (!id) return null
  const entry = (await readOrigins())[id]
  return isAppMode(entry?.mode) ? entry.mode : null
}

export const savePendingOrderNavigation = async(orderId, mode) => {
  const id = normalizeOrderId(orderId)
  if (!id || !isAppMode(mode)) return
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify({ orderId: id, mode }))
}

export const consumePendingOrderNavigation = async mode => {
  try {
    const pending = JSON.parse(await AsyncStorage.getItem(PENDING_KEY))
    if (!pending || pending.mode !== mode) return null
    await AsyncStorage.removeItem(PENDING_KEY)
    return normalizeOrderId(pending.orderId)
  } catch {
    await AsyncStorage.removeItem(PENDING_KEY)
    return null
  }
}

export const inferNotificationMode = async data => {
  const explicitMode = String(
    data?.appMode || data?.mode || data?.vendorMode || ''
  ).toUpperCase()
  if (isAppMode(explicitMode)) return explicitMode

  const orderId = data?._id || data?.orderId
  return getOrderOrigin(orderId)
}
