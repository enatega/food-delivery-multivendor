import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { METRICS_GENERAL } from '../apollo/publicAccess'
import { savePublicToken, getOrCreateNonce, isTokenExpired, getPublicToken, getTokenExpiry } from '../utils/publicAccessToken'
import { Platform } from 'react-native'

let tokenRefreshPromise = null

// Proactively refresh the public (bop-auth / MetricsGeneral) token this many ms
// before it actually expires, and keep a background timer running so the token
// is always fresh — instead of only refreshing lazily when a request happens to
// find it expired. This mirrors the store app (30s early background refresh)
// and the web app, and prevents the "Unauthorized: jwt expired" race where a
// request is sent right as the token expires.
const EXPIRY_BUFFER_MS = 30000
let refreshTimer = null

const scheduleNextRefresh = (graphqlUrl, expiryValue) => {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }

  if (!expiryValue) return

  const expiryMs = new Date(expiryValue).getTime()
  if (!expiryMs || Number.isNaN(expiryMs)) return

  // Fire at least 1s from now so we never schedule in the past; the chained
  // fetch re-schedules the following refresh on success.
  const delay = Math.max(expiryMs - Date.now() - EXPIRY_BUFFER_MS, 1000)

  refreshTimer = setTimeout(() => {
    fetchPublicAccessToken(graphqlUrl).catch(() => {})
  }, delay)
}

export const fetchPublicAccessToken = async (graphqlUrl) => {
  if (tokenRefreshPromise) {
    return tokenRefreshPromise
  }

  tokenRefreshPromise = (async () => {
    try {
      const nonce = await getOrCreateNonce()

      const client = new ApolloClient({
        link: createHttpLink({
          uri: graphqlUrl,
          headers: {
            'user-agent': `EnategaApp/${Platform.OS}`,
            'accept-language': 'en-US',
            'x-platform': Platform.OS,
            nonce: nonce
          }
        }),
        cache: new InMemoryCache()
      })

      const { data } = await client.mutate({
        mutation: METRICS_GENERAL
      })

      const token = data.metricsGeneral.experience
      const expiry = data.metricsGeneral.hehe

      await savePublicToken(token, expiry)

      // Keep the token fresh proactively instead of waiting for the next
      // request to discover it has expired.
      scheduleNextRefresh(graphqlUrl, expiry)

      return token
    } catch (error) {
      console.error('Failed to fetch public access token:', error.message)
      throw error
    } finally {
      tokenRefreshPromise = null
    }
  })()

  return tokenRefreshPromise
}

export const getValidPublicToken = async (graphqlUrl) => {
  const expired = await isTokenExpired()

  if (expired) {
    return await fetchPublicAccessToken(graphqlUrl)
  }

  return await getPublicToken()
}

// Call once on app start so the public token is fetched/refreshed up front and
// the background refresh timer starts, rather than refreshing only on demand.
export const initializePublicAccessToken = async (graphqlUrl) => {
  try {
    const expired = await isTokenExpired()

    if (expired) {
      await fetchPublicAccessToken(graphqlUrl)
    } else {
      const expiry = await getTokenExpiry()
      scheduleNextRefresh(graphqlUrl, expiry)
    }
  } catch (error) {
    console.warn('Public access token initialization failed:', error?.message ?? error)
  }
}

export const stopPublicAccessTokenRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
}
