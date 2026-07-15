import React, { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TenantContext from './TenantContext'
import { loadTenant, saveTenant, clearTenantStorage } from './tenantStorage'
import { CLEAR_KEYS_ON_SWITCH } from './tenantTypes'

export default function TenantProvider({ children }) {
  const [tenant, setTenantState] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTenant()
      .then(saved => setTenantState(saved))
      .catch(() => setTenantState(null))
      .finally(() => setIsLoading(false))
  }, [])

  const setTenant = useCallback(async (config) => {
    await saveTenant(config)
    setTenantState(config)
  }, [])

  const clearTenant = useCallback(async () => {
    await clearTenantStorage()
    await AsyncStorage.multiRemove(CLEAR_KEYS_ON_SWITCH)
    setTenantState(null)
  }, [])

  return (
    <TenantContext.Provider value={{ tenant, isLoading, setTenant, clearTenant }}>
      {children}
    </TenantContext.Provider>
  )
}
