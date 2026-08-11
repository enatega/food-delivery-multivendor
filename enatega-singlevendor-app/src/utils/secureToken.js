import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { APP_MODES } from '../mode/constants'

// SEC-003: The JWT is the primary auth credential. Persist it in the
// hardware-backed keystore (Android Keystore / iOS Keychain) via expo-secure-store
// instead of the unencrypted AsyncStorage SQLite DB.
//
// Legacy migration: any token previously written to AsyncStorage under the
//     'token' key is moved into SecureStore on first read, so existing sessions
//     survive the upgrade without forcing a re-login.

const LEGACY_TOKEN_KEY = 'token'
const TOKEN_KEY_PREFIX = 'customer-token'

export const getTokenKey = (mode = APP_MODES.MULTI) =>
  `${TOKEN_KEY_PREFIX}-${mode.toLowerCase()}`

const warnDev = (message, error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[secureToken] ${message}`, error)
  }
}

export const setToken = async (token, mode = APP_MODES.MULTI) => {
  if (token === null || token === undefined) {
    await deleteToken(mode)
    return
  }
  const tokenKey = getTokenKey(mode)
  try {
    await SecureStore.setItemAsync(tokenKey, token)
    // Drop any legacy plaintext copy once the secure copy is written.
    await AsyncStorage.removeItem(tokenKey).catch(() => {})
    if (mode === APP_MODES.MULTI) {
      await AsyncStorage.removeItem(LEGACY_TOKEN_KEY).catch(() => {})
    }
  } catch (error) {
    warnDev('SecureStore.setItemAsync failed', error)
    throw error
  }
}

export const getToken = async (mode = APP_MODES.MULTI) => {
  const tokenKey = getTokenKey(mode)
  try {
    const secured = await SecureStore.getItemAsync(tokenKey)
    if (secured) return secured

    // Existing releases used the unscoped "token" key. It belongs to the
    // multivendor server and is migrated exactly once.
    if (mode !== APP_MODES.MULTI) return null

    const legacySecure = await SecureStore.getItemAsync(LEGACY_TOKEN_KEY)
    const legacy =
      legacySecure || await AsyncStorage.getItem(LEGACY_TOKEN_KEY)
    if (legacy) {
      await SecureStore.setItemAsync(tokenKey, legacy)
      await SecureStore.deleteItemAsync(LEGACY_TOKEN_KEY).catch(() => {})
      await AsyncStorage.removeItem(LEGACY_TOKEN_KEY).catch(() => {})
      return legacy
    }
    return null
  } catch (error) {
    warnDev('SecureStore.getItemAsync failed', error)
    return null
  }
}

export const deleteToken = async (mode = APP_MODES.MULTI) => {
  const tokenKey = getTokenKey(mode)
  try {
    await SecureStore.deleteItemAsync(tokenKey)
  } catch (error) {
    warnDev('SecureStore.deleteItemAsync failed', error)
  }
  // Always clear any legacy AsyncStorage copy too.
  await AsyncStorage.removeItem(tokenKey).catch(() => {})
}
