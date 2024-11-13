import React, { useEffect } from 'react'

import ReactDOM from 'react-dom'
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  concat,
  createHttpLink,
  Observable,
  split
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import 'firebase/messaging'
import ConfigurableValues from './config/constants'
import { ConfigurationProvider } from './context/Configuration'
import App from './app'
import { RestProvider } from './context/Restaurant'
import { ThemeProvider, StyledEngineProvider } from '@mui/material'
import theme from './utils/theme'

function Main() {
  const { SERVER_URL, WS_SERVER_URL } = ConfigurableValues()

  const cache = new InMemoryCache()
  const httpLink = createHttpLink({
    uri: `${SERVER_URL}/graphql`
  })
  const wsLink = new WebSocketLink({
    uri: `${WS_SERVER_URL}/graphql`,
    options: {
      reconnect: true
    }
  })
  const request = async operation => {
    const data = localStorage.getItem('user-enatega')

    let token = null
    if (data) {
      token = JSON.parse(data).token
    }
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
    resolvers: {},
    connectToDevTools: true
  })

  return (
    <ApolloProvider client={client}>
      <ConfigurationProvider>
        {/* <LoadScript
          id="script-loader"
          googleMapsApiKey={GOOGLE_MAPS_KEY}
          libraries={[
            'drawing',
            'places',
            'geometry',
            'localContext',
            'visualization'
          ]}> */}

        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <RestProvider>
              {/* <GoogleMapsLoader> */}
              <App />
              {/* </GoogleMapsLoader> */}
            </RestProvider>
          </ThemeProvider>
        </StyledEngineProvider>

        {/* </LoadScript> */}
      </ConfigurationProvider>
    </ApolloProvider>
  )
}

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(<Main />, document.getElementById('root'))
