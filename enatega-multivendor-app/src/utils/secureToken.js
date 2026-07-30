import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'

// SEC-003: The JWT is the primary auth credential. Persist it in the
// hardware-backed keystore (Android Keystore / iOS Keychain) via expo-secure-store
// instead of the unencrypted AsyncStorage SQLite DB.
//
// Two safety nets:
//  1. Legacy migration — any token previously written to AsyncStorage under the
//     'token' key is moved into SecureStore on first read, so existing sessions
//     survive the upgrade without forcing a re-login.
//  2. Graceful fallback — if the SecureStore native module is unavailable (e.g.
//     an old build that hasn't been prebuilt/rebuilt yet), fall back to
//     AsyncStorage so the app keeps working instead of hard-crashing.

const TOKEN_KEY = 'token'

const warnDev = (message, error) => {
  if (__DEV__) console.warn(`[secureToken] ${message}`, error)
}

export const setToken = async (token) => {
  if (token === null || token === undefined) {
    await deleteToken()
    return
  }
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token)
    // Drop any legacy plaintext copy once the secure copy is written.
    await AsyncStorage.removeItem(TOKEN_KEY).catch(() => {})
  } catch (error) {
    warnDev('SecureStore.setItemAsync failed, using AsyncStorage', error)
    await AsyncStorage.setItem(TOKEN_KEY, token)
  }
}

export const getToken = async () => {
  try {
    const secured = await SecureStore.getItemAsync(TOKEN_KEY)
    if (secured) return secured

    // One-time migration of a legacy AsyncStorage token into SecureStore.
    const legacy = await AsyncStorage.getItem(TOKEN_KEY)
    if (legacy) {
      await SecureStore.setItemAsync(TOKEN_KEY, legacy)
      await AsyncStorage.removeItem(TOKEN_KEY).catch(() => {})
      return legacy
    }
    return null
  } catch (error) {
    warnDev('SecureStore.getItemAsync failed, using AsyncStorage', error)
    return AsyncStorage.getItem(TOKEN_KEY)
  }
}

export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
  } catch (error) {
    warnDev('SecureStore.deleteItemAsync failed', error)
  }
  // Always clear any legacy AsyncStorage copy too.
  await AsyncStorage.removeItem(TOKEN_KEY).catch(() => {})
}
