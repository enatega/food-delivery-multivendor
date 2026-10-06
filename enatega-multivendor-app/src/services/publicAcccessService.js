import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { METRICS_GENERAL } from '../apollo/publicAccess'
import { savePublicToken, getOrCreateNonce, isTokenExpired, getPublicToken, getTokenExpiry } from '../utils/publicAccessToken'
import { Platform } from 'react-native'

// Multi-vendor and single-vendor are different backends with different public
// tokens, so in-flight refreshes and refresh timers are tracked per GraphQL URL.
// A shared slot let one backend's request await (and use) the other's token.
const tokenRefreshPromises = new Map()
const refreshTimers = new Map()
const TOKEN_FETCH_TIMEOUT_MS = 10000

// Proactively refresh the public (bop-auth / MetricsGeneral) token this many ms
// before it actually expires, and keep a background timer running so the token
// is always fresh — instead of only refreshing lazily when a request happens to
// find it expired. This mirrors the store app (30s early background refresh)
// and the web app, and prevents the "Unauthorized: jwt expired" race where a
// request is sent right as the token expires.
const EXPIRY_BUFFER_MS = 30000
const clearRefreshTimer = (graphqlUrl) => {
  const timer = refreshTimers.get(graphqlUrl)
  if (timer) clearTimeout(timer)
  refreshTimers.delete(graphqlUrl)
}

const scheduleNextRefresh = (graphqlUrl, expiryValue) => {
  clearRefreshTimer(graphqlUrl)

  if (!expiryValue) return

  const expiryMs = new Date(expiryValue).getTime()
  if (!expiryMs || Number.isNaN(expiryMs)) return

  // Fire at least 1s from now so we never schedule in the past; the chained
  // fetch re-schedules the following refresh on success.
  const delay = Math.max(expiryMs - Date.now() - EXPIRY_BUFFER_MS, 1000)

  refreshTimers.set(graphqlUrl, setTimeout(() => {
    refreshTimers.delete(graphqlUrl)
    fetchPublicAccessToken(graphqlUrl).catch(() => {})
  }, delay))
}

export const fetchPublicAccessToken = async(graphqlUrl) => {
  const inFlight = tokenRefreshPromises.get(graphqlUrl)
  if (inFlight) {
    return inFlight
  }

  const refreshPromise = (async() => {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
    const timer = controller ? setTimeout(() => controller.abort(), TOKEN_FETCH_TIMEOUT_MS) : null
    try {
      const nonce = await getOrCreateNonce(graphqlUrl)

      const client = new ApolloClient({
        link: createHttpLink({
          uri: graphqlUrl,
          headers: {
            'user-agent': `EnategaApp/${Platform.OS}`,
            'accept-language': 'en-US',
            'x-platform': Platform.OS,
            nonce
          }
        }),
        cache: new InMemoryCache()
      })

      const { data } = await client.mutate({
        mutation: METRICS_GENERAL,
        context: controller ? { fetchOptions: { signal: controller.signal } } : undefined
      })

      const token = data.metricsGeneral.experience
      const expiry = data.metricsGeneral.hehe

      await savePublicToken(token, expiry, graphqlUrl)

      // Keep the token fresh proactively instead of waiting for the next
      // request to discover it has expired.
      scheduleNextRefresh(graphqlUrl, expiry)

      return token
    } catch (error) {
      console.error('Failed to fetch public access token:', error.message)
      throw error
    } finally {
      if (timer) clearTimeout(timer)
      tokenRefreshPromises.delete(graphqlUrl)
    }
  })()

  tokenRefreshPromises.set(graphqlUrl, refreshPromise)
  return refreshPromise
}

export const getValidPublicToken = async(graphqlUrl) => {
  const expired = await isTokenExpired(graphqlUrl)

  if (expired) {
    return await fetchPublicAccessToken(graphqlUrl)
  }

  return await getPublicToken(graphqlUrl)
}

// Call once on app start so the public token is fetched/refreshed up front and
// the background refresh timer starts, rather than refreshing only on demand.
export const initializePublicAccessToken = async(graphqlUrl) => {
  try {
    const expired = await isTokenExpired(graphqlUrl)

    if (expired) {
      await fetchPublicAccessToken(graphqlUrl)
    } else {
      const expiry = await getTokenExpiry(graphqlUrl)
      scheduleNextRefresh(graphqlUrl, expiry)
    }
  } catch (error) {
    console.warn('Public access token initialization failed:', error?.message ?? error)
  }
}

// Stops the background refresh for one backend, or for all when no URL is given.
export const stopPublicAccessTokenRefresh = (graphqlUrl) => {
  if (graphqlUrl) {
    clearRefreshTimer(graphqlUrl)
    return
  }
  refreshTimers.forEach((timer) => clearTimeout(timer))
  refreshTimers.clear()
}
