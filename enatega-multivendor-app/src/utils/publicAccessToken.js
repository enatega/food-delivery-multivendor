import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Device from 'expo-device'
import * as Crypto from 'expo-crypto'

const STORAGE_KEYS = {
  TOKEN: '_sys_cache_v2',
  NONCE: '_device_fp_id',
  EXPIRY: '_session_ttl'
}

const generateNonce = async () => {
  const deviceId = Device.modelId || Device.osInternalBuildId || 'unknown'
  const timestamp = Date.now()
  // Use a cryptographically secure UUID instead of Math.random() so the device
  // fingerprint nonce is not predictable (PERF-012).
  const random = Crypto.randomUUID()
  return `${deviceId}-${timestamp}-${random}`
}

export const getOrCreateNonce = async () => {
  let nonce = await AsyncStorage.getItem(STORAGE_KEYS.NONCE)
  if (!nonce) {
    nonce = await generateNonce()
    await AsyncStorage.setItem(STORAGE_KEYS.NONCE, nonce)
  }
  return nonce
}

export const savePublicToken = async (token, expiry) => {
  await AsyncStorage.multiSet([
    [STORAGE_KEYS.TOKEN, token],
    [STORAGE_KEYS.EXPIRY, expiry]
  ])
}

export const getPublicToken = async () => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
  return token
}

export const getTokenExpiry = async () => {
  const expiry = await AsyncStorage.getItem(STORAGE_KEYS.EXPIRY)
  return expiry
}

// Treat the token as expired a little before it actually lapses so a request
// that is being built now isn't sent with a token that expires in flight
// (clock skew / network latency) and comes back "Unauthorized: jwt expired".
const EXPIRY_SKEW_MS = 15000

export const isTokenExpired = async () => {
  const expiry = await getTokenExpiry()
  if (!expiry) return true
  return new Date(expiry).getTime() - EXPIRY_SKEW_MS <= Date.now()
}

export const clearPublicToken = async () => {
  await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.EXPIRY])
}