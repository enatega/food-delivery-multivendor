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
  DEFAULT_SINGLE_VENDOR,
  isAppMode
} from './constants'
const { getEnvironmentConfig } = require('../../environment.config')

const AppModeContext = createContext({
  mode: DEFAULT_APP_MODE,
  isModeReady: false,
  isSwitchingMode: false,
  isModeSwitchBlocked: false,
  isModeSelectionLocked: DEFAULT_SINGLE_VENDOR,
  beginModeSensitiveOperation: () => () => {},
  switchMode: async() => false
})

export const AppModeProvider = ({ children }) => {
  const [mode, setMode] = useState(DEFAULT_APP_MODE)
  const [isModeReady, setIsModeReady] = useState(false)
  const [isSwitchingMode, setIsSwitchingMode] = useState(false)
  const [blockingOperationCount, setBlockingOperationCount] = useState(0)
  const blockingOperations = useRef(new Set())
  const singleVendorAvailable =
    DEFAULT_SINGLE_VENDOR ||
    getEnvironmentConfig(Updates.channel, APP_MODES.SINGLE)
      .SINGLE_VENDOR_ENABLED

  useEffect(() => {
    let mounted = true

    if (DEFAULT_SINGLE_VENDOR) {
      AsyncStorage.setItem(APP_MODE_STORAGE_KEY, APP_MODES.SINGLE)
        .finally(() => {
          if (!mounted) return
          setMode(APP_MODES.SINGLE)
          setIsModeReady(true)
        })
      return () => {
        mounted = false
      }
    }

    AsyncStorage.getItem(APP_MODE_STORAGE_KEY)
      .then(storedMode => {
        if (!mounted || !isAppMode(storedMode)) return
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
  }, [singleVendorAvailable])

  const switchMode = useCallback(async nextMode => {
    if (DEFAULT_SINGLE_VENDOR && nextMode !== APP_MODES.SINGLE) return false
    if (
      !isAppMode(nextMode) ||
      nextMode === mode ||
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
  }, [mode, singleVendorAvailable])

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
    isModeSelectionLocked: DEFAULT_SINGLE_VENDOR,
    beginModeSensitiveOperation,
    switchMode,
    singleVendorAvailable,
    isSingleVendor: mode === APP_MODES.SINGLE
  }), [
    beginModeSensitiveOperation,
    blockingOperationCount,
    isModeReady,
    isSwitchingMode,
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
