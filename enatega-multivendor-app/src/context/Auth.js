import React, { useEffect, useState } from 'react'
import { getToken, setToken as persistToken } from '../utils/secureToken'
import {
  getJwtExpiryTime,
  isJwtTokenExpired
} from '../utils/decode-jwt'
import {
  invalidateUserSession,
  subscribeToSessionInvalidation
} from '../utils/session'
import { useAppMode } from '../mode/AppModeContext'

const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const { mode } = useAppMode()
  const [token, setToken] = useState(null)

  const setTokenAsync = async token => {
    await persistToken(token, mode)
    setToken(token)
  }

  useEffect(() => {
    let isSubscribed = true
    ;(async() => {
      setToken(null)
      const storedToken = await getToken(mode)

      if (!storedToken) {
        isSubscribed && setToken(null)
        return
      }

      if (isJwtTokenExpired(storedToken)) {
        await invalidateUserSession({ reason: 'token_expired', mode })
        isSubscribed && setToken(null)
        return
      }

      isSubscribed && setToken(storedToken)
    })()
    return () => {
      isSubscribed = false
    }
  }, [mode])

  useEffect(() => {
    const unsubscribe = subscribeToSessionInvalidation(payload => {
      if (payload?.mode && payload.mode !== mode) return
      setToken(null)
    })

    return unsubscribe
  }, [mode])

  useEffect(() => {
    if (!token) return undefined

    const expiryTime = getJwtExpiryTime(token)
    if (!expiryTime) {
      void invalidateUserSession({ reason: 'invalid_token', mode })
      return undefined
    }

    const timeoutMs = Math.max(expiryTime - Date.now(), 0)
    const timeoutId = setTimeout(() => {
      void invalidateUserSession({ reason: 'token_expired', mode })
    }, timeoutMs)

    return () => clearTimeout(timeoutId)
  }, [mode, token])

  return (
    <AuthContext.Provider value={{ token, setToken, setTokenAsync}}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer
export default AuthContext
