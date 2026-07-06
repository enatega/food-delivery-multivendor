import AsyncStorage from '@react-native-async-storage/async-storage'

const sessionListeners = new Set()
const sessionModalDismissListeners = new Set()
let sessionInvalidationPromise = null
let logoutInProgress = false
export const SESSION_EXPIRY_REASONS = [
  'invalid_token',
  'token_expired',
  'network_unauthorized',
  'graphql_unauthenticated'
]

export const subscribeToSessionInvalidation = (listener) => {
  sessionListeners.add(listener)

  return () => {
    sessionListeners.delete(listener)
  }
}

export const subscribeToSessionExpiredModalDismiss = (listener) => {
  sessionModalDismissListeners.add(listener)

  return () => {
    sessionModalDismissListeners.delete(listener)
  }
}

export const dismissSessionExpiredModal = () => {
  const listeners = Array.from(sessionModalDismissListeners)
  return Promise.allSettled(
    listeners.map(listener => Promise.resolve(listener()))
  )
}

export const setLogoutInProgress = (value) => {
  logoutInProgress = value
}

export const isLogoutInProgress = () => logoutInProgress

export const invalidateUserSession = async (payload = {}) => {
  if (logoutInProgress) {
    return null
  }

  if (sessionInvalidationPromise) {
    return sessionInvalidationPromise
  }

  sessionInvalidationPromise = (async () => {
    try {
      await AsyncStorage.removeItem('token')

      const listeners = Array.from(sessionListeners)
      await Promise.allSettled(
        listeners.map(listener => Promise.resolve(listener(payload)))
      )
    } finally {
      sessionInvalidationPromise = null
    }
  })()

  return sessionInvalidationPromise
}

export const shouldShowSessionExpiredModal = (reason) => {
  return SESSION_EXPIRY_REASONS.includes(reason)
}
