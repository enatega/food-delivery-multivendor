import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { METRICS_GENERAL } from '../apollo/publicAccess'
import { savePublicToken, getOrCreateNonce, isTokenExpired, getPublicToken } from '../utils/publicAccessToken'
import { Platform } from 'react-native'

let tokenRefreshPromise = null

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
