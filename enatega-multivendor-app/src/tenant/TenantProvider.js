import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import TenantContext from './TenantContext'
import { loadTenant, saveTenant, clearTenantStorage } from './tenantStorage'
import { CLEAR_KEYS_ON_SWITCH } from './tenantTypes'
import { fetchTenantConfig } from './tenantApi'

// Slug baked into this APK at build time (null in the universal/staging build)
const BAKED_SLUG = Constants.expoConfig?.extra?.tenantSlug || null

export default function TenantProvider({ children }) {
  const [tenant, setTenantState] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function init() {
      // 1. Try a previously cached tenant config (covers re-opens after first launch)
      const saved = await loadTenant().catch(() => null)
      if (saved) {
        // For white-label APKs, always use the baked slug — ignore any stale cached slug
        if (BAKED_SLUG && saved.slug !== BAKED_SLUG) {
          await clearTenantStorage()
        } else {
          setTenantState(saved)
          setIsLoading(false)
          return
        }
      }

      // 2. If a tenant slug is baked in, resolve it silently — no selection screen
      if (BAKED_SLUG) {
        try {
          const config = await fetchTenantConfig(BAKED_SLUG)
          await saveTenant(config)
          setTenantState(config)
        } catch {
          // Network unavailable on first launch — will retry next open
          setTenantState(null)
        }
        setIsLoading(false)
        return
      }

      // 3. Universal APK — show TenantSelectionScreen
      setTenantState(null)
      setIsLoading(false)
    }

    init()
  }, [])

  const setTenant = useCallback(async (config) => {
    await saveTenant(config)
    setTenantState(config)
  }, [])

  const clearTenant = useCallback(async () => {
    // White-label builds are locked to their tenant — switching is disabled
    if (BAKED_SLUG) return
    await clearTenantStorage()
    await AsyncStorage.multiRemove(CLEAR_KEYS_ON_SWITCH)
    setTenantState(null)
  }, [])

  return (
    <TenantContext.Provider value={{ tenant, isLoading, setTenant, clearTenant, isWhiteLabel: Boolean(BAKED_SLUG) }}>
      {children}
    </TenantContext.Provider>
  )
}
