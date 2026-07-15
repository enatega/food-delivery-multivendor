import AsyncStorage from '@react-native-async-storage/async-storage'
import { TENANT_STORAGE_KEY, TENANT_SLUG_KEY } from './tenantTypes'

export async function saveTenant(config) {
  await AsyncStorage.multiSet([
    [TENANT_STORAGE_KEY, JSON.stringify(config)],
    [TENANT_SLUG_KEY, config.slug],
  ])
}

export async function loadTenant() {
  const raw = await AsyncStorage.getItem(TENANT_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function clearTenantStorage() {
  await AsyncStorage.multiRemove([TENANT_STORAGE_KEY, TENANT_SLUG_KEY])
}
