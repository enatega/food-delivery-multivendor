import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  split,
  concat,
  Observable
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import {
  getMainDefinition,
  offsetLimitPagination
} from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { calculateDistance } from '../utils/customFunctions'
import { getValidPublicToken } from '../services/publicAcccessService'
import { getOrCreateNonce } from '../utils/publicAccessToken'
import { Platform } from 'react-native'
import { isJwtTokenExpired } from '../utils/decode-jwt'
import { invalidateUserSession } from '../utils/session'

const setupApollo = ({ GRAPHQL_URL, WS_GRAPHQL_URL }) => {
  const publicOperations = new Set(['ForgotPassword', 'VerifyOtp', 'ResetPassword'])

  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          _id: {
            keyArgs: ['string']
          },
          orders: offsetLimitPagination()
        }
      },
      Category: {
        fields: {
          foods: {
            merge(_existing, incoming) {
              return incoming
            }
          }
        }
      },
      Food: {
        fields: {
          variations: {
            merge(_existing, incoming) {
              return incoming
            }
          }
        }
      },
      // The backend omits `image` on some legacy order items / restaurants
      // (it returns undefined rather than null). A `read` policy tells Apollo
      // the field is optional, which both silences the "Missing field 'image'"
      // cache warnings and normalizes the absent value to null.
      Item: {
        fields: {
          image: {
            read(existing = null) {
              return existing
            }
          }
        }
      },
      RestaurantDetail: {
        fields: {
          image: {
            read(existing = null) {
              return existing
            }
          }
        }
      },
      RestaurantPreview: {
        fields: {
          distanceWithCurrentLocation: {
            read(_existing, {variables, field, readField}) {
              const restaurantLocation = readField('location')
              const distance = calculateDistance(restaurantLocation?.coordinates[0], restaurantLocation?.coordinates[1], variables.latitude, variables.longitude)
              return distance
            }
          }
        }
      }
    }
  })

  const httpLink = createHttpLink({
    uri: GRAPHQL_URL
  })

  const wsLink = new WebSocketLink({
    uri: WS_GRAPHQL_URL,
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: async () => {
        const token = await AsyncStorage.getItem('token')
        const hasExpiredUserToken = token && isJwtTokenExpired(token)

        if (hasExpiredUserToken) {
          await invalidateUserSession({ reason: 'token_expired' })
        }

        return {
          authorization: token && !hasExpiredUserToken ? `Bearer ${token}` : ''
        }
      }
    }
  })

  const request = async operation => {
    const publicToken = await getValidPublicToken(GRAPHQL_URL)
    const nonce = await getOrCreateNonce()
    const isPublicOperation = publicOperations.has(operation.operationName)
    const token = isPublicOperation ? null : await AsyncStorage.getItem('token')
    const hasExpiredUserToken = token && isJwtTokenExpired(token)

    if (hasExpiredUserToken) {
      await invalidateUserSession({ reason: 'token_expired' })
    }

    operation.setContext({
      headers: {
        authorization: token && !hasExpiredUserToken ? `Bearer ${token}` : '',
        "bop-auth": publicToken ? `Bearer ${publicToken}` : '',
        nonce: nonce,
        'user-agent': `EnategaApp/${Platform.OS}`,
        'accept-language': 'en-US',
        'x-platform': Platform.OS
      }
    })
  }

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable(observer => {
        let handle
        Promise.resolve(operation)
          .then(oper => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer)
            })
          })
          .catch(observer.error.bind(observer))

        return () => {
          if (handle) handle.unsubscribe()
        }
      })
  )

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    const hasInvalidSession = (graphQLErrors || []).some(
      (graphQLError) =>
        graphQLError?.extensions?.code === 'UNAUTHENTICATED' ||
        graphQLError?.extensions?.code === 'TOKEN_EXPIRED' ||
        graphQLError?.extensions?.code === 'INVALID_TOKEN'
    )
    const hasUnauthorizedNetworkError =
      networkError?.statusCode === 401 ||
      networkError?.response?.status === 401

    if (hasInvalidSession || hasUnauthorizedNetworkError) {
      void invalidateUserSession({
        reason: hasUnauthorizedNetworkError ? 'network_unauthorized' : 'graphql_unauthenticated'
      })
    }
  })

  const terminatingLink = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    concat(requestLink, httpLink)
  )

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, terminatingLink]),
    cache,
    resolvers: {}
  })

  return client
}

export default setupApollo
