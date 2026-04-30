import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  concat,
  Observable
} from '@apollo/client'
import {
  offsetLimitPagination
} from '@apollo/client/utilities'
import useEnvVars from '../../environment'
import { calculateDistance } from '../utils/customFunctions'
import { getValidPublicToken } from '../services/publicAcccessService'
import { getOrCreateNonce } from '../utils/publicAccessToken'
import { Platform } from 'react-native'

const setupApollo = () => {
  const { GRAPHQL_URL } = useEnvVars()

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
            read(_existing, { variables, readField }) {
              const restaurantLocation = readField('location')
              const distance = calculateDistance(
                restaurantLocation?.coordinates[0],
                restaurantLocation?.coordinates[1],
                variables.latitude,
                variables.longitude
              )
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

  const request = async operation => {
    const token = await AsyncStorage.getItem('token')
    const publicToken = await getValidPublicToken(GRAPHQL_URL)
    const nonce = await getOrCreateNonce()

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
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

  const client = new ApolloClient({
    link: concat(requestLink, httpLink),
    cache
  })

  return client
}

export default setupApollo
