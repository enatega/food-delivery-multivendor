import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Updates from 'expo-updates'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import {
  APP_MODES,
  APP_MODE_STORAGE_KEY,
  DEFAULT_APP_MODE,
  getForcedAppMode,
  isAppMode
} from './constants'
const { getEnvironmentConfig } = require('../../environment.config')

const AppModeContext = createContext({
  mode: DEFAULT_APP_MODE,
  isModeReady: false,
  isSwitchingMode: false,
  isModeSwitchBlocked: false,
  isModeToggleEnabled: true,
  beginModeSensitiveOperation: () => () => {},
  switchMode: async() => false
})

export const AppModeProvider = ({ children }) => {
  const [mode, setMode] = useState(DEFAULT_APP_MODE)
  const [isModeReady, setIsModeReady] = useState(false)
  const [isSwitchingMode, setIsSwitchingMode] = useState(false)
  const [blockingOperationCount, setBlockingOperationCount] = useState(0)
  const blockingOperations = useRef(new Set())
  const forcedMode = getForcedAppMode()
  const isModeToggleEnabled = forcedMode === null
  const singleVendorAvailable =
    forcedMode === APP_MODES.SINGLE ||
    getEnvironmentConfig(Updates.channel, APP_MODES.SINGLE).SINGLE_VENDOR_ENABLED

  useEffect(() => {
    let mounted = true

    AsyncStorage.getItem(APP_MODE_STORAGE_KEY)
      .then(storedMode => {
        if (!mounted) return
        if (forcedMode) {
          setMode(forcedMode)
          if (storedMode !== forcedMode) {
            AsyncStorage.setItem(APP_MODE_STORAGE_KEY, forcedMode).catch(() => {})
          }
          return
        }
        if (!isAppMode(storedMode)) return
        if (
          storedMode === APP_MODES.SINGLE &&
          !singleVendorAvailable
        ) {
          AsyncStorage.setItem(APP_MODE_STORAGE_KEY, APP_MODES.MULTI).catch(() => {})
          return
        }
        setMode(storedMode)
      })
      .finally(() => {
        if (mounted) setIsModeReady(true)
      })

    return () => {
      mounted = false
    }
  }, [forcedMode, singleVendorAvailable])

  const switchMode = useCallback(async nextMode => {
    if (
      !isAppMode(nextMode) ||
      nextMode === mode ||
      !isModeToggleEnabled ||
      blockingOperations.current.size > 0 ||
      (nextMode === APP_MODES.SINGLE && !singleVendorAvailable)
    ) return false

    setIsSwitchingMode(true)
    try {
      await AsyncStorage.setItem(APP_MODE_STORAGE_KEY, nextMode)
      setMode(nextMode)
      return true
    } finally {
      setIsSwitchingMode(false)
    }
  }, [isModeToggleEnabled, mode, singleVendorAvailable])

  const beginModeSensitiveOperation = useCallback(() => {
    const operation = Symbol('mode-sensitive-operation')
    blockingOperations.current.add(operation)
    setBlockingOperationCount(blockingOperations.current.size)

    return () => {
      blockingOperations.current.delete(operation)
      setBlockingOperationCount(blockingOperations.current.size)
    }
  }, [])

  const value = useMemo(() => ({
    mode,
    isModeReady,
    isSwitchingMode,
    isModeSwitchBlocked: blockingOperationCount > 0,
    isModeToggleEnabled,
    beginModeSensitiveOperation,
    switchMode,
    singleVendorAvailable,
    isSingleVendor: mode === APP_MODES.SINGLE
  }), [
    beginModeSensitiveOperation,
    blockingOperationCount,
    isModeReady,
    isSwitchingMode,
    isModeToggleEnabled,
    mode,
    singleVendorAvailable,
    switchMode
  ])

  return (
    <AppModeContext.Provider value={value}>
      {children}
    </AppModeContext.Provider>
  )
}

export const useAppMode = () => useContext(AppModeContext)

export const useModeSensitiveOperation = isActive => {
  const { beginModeSensitiveOperation } = useAppMode()

  useEffect(() => {
    if (!isActive) return undefined
    return beginModeSensitiveOperation()
  }, [beginModeSensitiveOperation, isActive])
}

export default AppModeContext
