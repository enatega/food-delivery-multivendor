import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Device from 'expo-device'

const STORAGE_KEYS = {
  TOKEN: '_sys_cache_v2',
  NONCE: '_device_fp_id',
  EXPIRY: '_session_ttl'
}

const generateNonce = async () => {
  const deviceId = Device.modelId || Device.osInternalBuildId || 'unknown'
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
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

export const isTokenExpired = async () => {
  const expiry = await getTokenExpiry()
  if (!expiry) return true
  return new Date(expiry).getTime() <= Date.now()
}

export const clearPublicToken = async () => {
  await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.EXPIRY])
}