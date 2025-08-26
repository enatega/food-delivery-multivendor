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

const setupApollo = () => {
  const { GRAPHQL_URL, WS_GRAPHQL_URL } = useEnvVars()

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
    uri: GRAPHQL_URL
  })

  const wsLink = new WebSocketLink({
    uri: WS_GRAPHQL_URL,
    options: {
      reconnect: true
    }
  })

  const request = async operation => {
    const token = await AsyncStorage.getItem('token')

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
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

  const terminatingLink = split(({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  }, wsLink)

  const client = new ApolloClient({
    link: concat(ApolloLink.from([terminatingLink, requestLink]), httpLink),
    cache,
    resolvers: {}
  })

  return client
}

export default setupApollo
