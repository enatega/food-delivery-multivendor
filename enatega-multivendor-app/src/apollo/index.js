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
import {
  getMainDefinition,
  offsetLimitPagination
} from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import useEnvVars from '../../environment'
import { useContext } from 'react'
import { LocationContext } from '../context/Location'
import { calculateDistance } from '../utils/customFunctions'
import { getValidPublicToken } from '../services/publicAcccessService'
import { getOrCreateNonce } from '../utils/publicAccessToken'
import { Platform } from 'react-native'
import { TENANT_SLUG_KEY } from '../tenant/tenantTypes'

/**
 * @param {string|null} apiUrlOverride  Tenant's GraphQL HTTP URL, e.g.
 *   "https://saas-demo-production-233c.up.railway.app/graphql"
 *   When null/undefined the default from environment.js is used.
 */
const setupApollo = (apiUrlOverride) => {
  const { GRAPHQL_URL, WS_GRAPHQL_URL } = useEnvVars()

  // Prefer the tenant-specific URL when provided
  const graphqlUrl = apiUrlOverride || GRAPHQL_URL
  const wsUrl = apiUrlOverride
    ? apiUrlOverride.replace(/^https?:\/\//, (m) => (m.startsWith('https') ? 'wss://' : 'ws://'))
    : WS_GRAPHQL_URL

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
      RestaurantPreview: {
        fields: {
          distanceWithCurrentLocation: {
            read(_existing, {variables, field, readField}) {
              const restaurantLocation = readField('location')
              const distance = calculateDistance(restaurantLocation?.coordinates[0], restaurantLocation?.coordinates[1], variables.latitude, variables.longitude)
              return distance
            }
          },
          freeDelivery: {
            read(_existing) {
              const randomValue = Math.random() * 10;
              return randomValue > 5
            }
          },
          acceptVouchers: {
            read(_existing) {
              const randomValue = Math.random() * 10;
              return randomValue < 5
            }
          },
        }
      }
    }
  })

  const httpLink = createHttpLink({
    uri: graphqlUrl
  })

  const wsLink = new WebSocketLink({
    uri: wsUrl,
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: async () => {
        const token = await AsyncStorage.getItem('token')
        const tenantSlug = await AsyncStorage.getItem(TENANT_SLUG_KEY)
        return {
          authorization: token ? `Bearer ${token}` : '',
          ...(tenantSlug ? { 'x-tenant-slug': tenantSlug } : {}),
        }
      }
    }
  })

  const request = async operation => {
    const token = await AsyncStorage.getItem('token')
    const publicToken = await getValidPublicToken(graphqlUrl)
    const nonce = await getOrCreateNonce()
    const tenantSlug = await AsyncStorage.getItem(TENANT_SLUG_KEY)

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
        "bop-auth": publicToken ? `Bearer ${publicToken}` : '',
        nonce: nonce,
        'user-agent': `EnategaApp/${Platform.OS}`,
        'accept-language': 'en-US',
        'x-platform': Platform.OS,
        ...(tenantSlug ? { 'x-tenant-slug': tenantSlug } : {}),
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

  const terminatingLink = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    concat(requestLink, httpLink)
  )

  const client = new ApolloClient({
    link: terminatingLink,
    cache,
    resolvers: {}
  })

  return client
}

export default setupApollo
