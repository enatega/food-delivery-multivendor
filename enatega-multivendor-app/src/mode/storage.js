import AsyncStorage from '@react-native-async-storage/async-storage'

import { APP_MODES } from './constants'

const SHARED_KEYS = new Set([
  'enatega-language',
  'enatega-language-name',
  'appTheme',
  'knownOrderOrigins',
  'pendingOrderNavigation'
])

export const getModeStorageKey = (key, mode) => {
  if (SHARED_KEYS.has(key)) return key
  return `@enatega/${mode.toLowerCase()}/${key}`
}

export const getModeItem = (key, mode) =>
  AsyncStorage.getItem(getModeStorageKey(key, mode))

export const setModeItem = (key, value, mode) =>
  AsyncStorage.setItem(getModeStorageKey(key, mode), value)

export const removeModeItem = (key, mode) =>
  AsyncStorage.removeItem(getModeStorageKey(key, mode))

export const migrateMultivendorStorage = async() => {
  const keys = ['restaurant', 'cartItems', 'coupon', '@lastNotificationHandledId']

  await Promise.all(keys.map(async(key) => {
    const scopedKey = getModeStorageKey(key, APP_MODES.MULTI)
    const [legacyValue, scopedValue] = await Promise.all([
      AsyncStorage.getItem(key),
      AsyncStorage.getItem(scopedKey)
    ])

    if (legacyValue !== null && scopedValue === null) {
      await AsyncStorage.setItem(scopedKey, legacyValue)
    }
    if (legacyValue !== null) await AsyncStorage.removeItem(key)
  }))
}
