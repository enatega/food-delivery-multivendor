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

const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)

  const setTokenAsync = async token => {
    await persistToken(token)
    setToken(token)
  }

  useEffect(() => {
    let isSubscribed = true
    ;(async() => {
      const storedToken = await getToken()

      if (!storedToken) {
        isSubscribed && setToken(null)
        return
      }

      if (isJwtTokenExpired(storedToken)) {
        await invalidateUserSession({ reason: 'token_expired' })
        isSubscribed && setToken(null)
        return
      }

      isSubscribed && setToken(storedToken)
    })()
    return () => {
      isSubscribed = false
    }
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToSessionInvalidation(() => {
      setToken(null)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!token) return undefined

    const expiryTime = getJwtExpiryTime(token)
    if (!expiryTime) {
      void invalidateUserSession({ reason: 'invalid_token' })
      return undefined
    }

    const timeoutMs = Math.max(expiryTime - Date.now(), 0)
    const timeoutId = setTimeout(() => {
      void invalidateUserSession({ reason: 'token_expired' })
    }, timeoutMs)

    return () => clearTimeout(timeoutId)
  }, [token])

  return (
    <AuthContext.Provider value={{ token, setToken, setTokenAsync}}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer
export default AuthContext
