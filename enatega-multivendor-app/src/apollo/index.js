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
import { getValidPublicToken, fetchPublicAccessToken } from '../services/publicAcccessService'
import { getOrCreateNonce } from '../utils/publicAccessToken'
import { Platform } from 'react-native'
import { isJwtTokenExpired } from '../utils/decode-jwt'
import { invalidateUserSession } from '../utils/session'
import { FlashMessage } from '../ui/FlashMessage/FlashMessage'
import i18n from '../../i18next'

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

  // Auth errors tied to the *logged-in user's* JWT — these must log the user
  // out (handled by invalidateUserSession + the session-expired modal).
  const USER_SESSION_CODES = new Set([
    'UNAUTHENTICATED',
    'TOKEN_EXPIRED',
    'INVALID_TOKEN'
  ])

  // Auth failures tied to the *public access token* (bop-auth / MetricsGeneral),
  // NOT the user's session. The backend reports these as a generic message
  // (e.g. "Unauthorized: jwt expired") without a user-session extension code.
  const isPublicTokenAuthMessage = (message = '') =>
    /unauthorized|unauthenticated|jwt expired|invalid token|forbidden/i.test(message)

  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    const gqlErrors = graphQLErrors || []

    const hasInvalidSession = gqlErrors.some((graphQLError) =>
      USER_SESSION_CODES.has(graphQLError?.extensions?.code)
    )
    const hasUnauthorizedNetworkError =
      networkError?.statusCode === 401 ||
      networkError?.response?.status === 401

    if (hasInvalidSession || hasUnauthorizedNetworkError) {
      void invalidateUserSession({
        reason: hasUnauthorizedNetworkError ? 'network_unauthorized' : 'graphql_unauthenticated'
      })
      return
    }

    // Public-token expiry: the user is still logged in (which is why a manual
    // pull-to-refresh already "fixes" it). Refresh the public token and replay
    // the request transparently — once per operation — so the user never sees
    // the raw Apollo/GraphQL "Unauthorized" error.
    const isPublicTokenError = gqlErrors.some((graphQLError) =>
      isPublicTokenAuthMessage(graphQLError?.message)
    )

    if (!isPublicTokenError) return

    const alreadyRetried = operation.getContext()?.publicTokenRetried

    if (alreadyRetried) {
      // The silent refresh + retry still failed. Surface a human, non-technical
      // message instead of the raw GraphQL error string.
      FlashMessage({ message: i18n.t('sessionRefreshFailed'), duration: 2500 })
      return
    }

    return new Observable((observer) => {
      let handle
      fetchPublicAccessToken(GRAPHQL_URL)
        .then(() => {
          operation.setContext((prev) => ({ ...prev, publicTokenRetried: true }))
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          })
        })
        .catch((refreshError) => {
          FlashMessage({ message: i18n.t('sessionRefreshFailed'), duration: 2500 })
          observer.error(refreshError)
        })

      return () => {
        if (handle) handle.unsubscribe()
      }
    })
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
