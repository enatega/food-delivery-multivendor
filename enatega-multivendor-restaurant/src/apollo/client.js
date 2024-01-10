import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import getEnvVars from '../../environment'
import * as SecureStore from 'expo-secure-store'
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  split,
  concat,
  Observable,
  createHttpLink
} from '@apollo/client'

export let clientRef = null
function setupApolloClient() {
  const { GRAPHQL_URL, WS_GRAPHQL_URL } = getEnvVars()
  const wsLink = new WebSocketLink({
    uri: WS_GRAPHQL_URL,
    options: {
      reconnect: true
    }
  })
  const cache = new InMemoryCache()
  // eslint-disable-next-line new-cap
  const httpLink = new createHttpLink({
    uri: GRAPHQL_URL
  })
  const terminatingLink = split(({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  }, wsLink)

  const request = async operation => {
    const token = await SecureStore.getItemAsync('token')
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

  const client = new ApolloClient({
    cache: cache,
    link: concat(ApolloLink.from([terminatingLink, requestLink]), httpLink)
  })
  clientRef = client
  return client
}

export default setupApolloClient
