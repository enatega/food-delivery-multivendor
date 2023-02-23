import React from 'react'
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
import { LoadScript } from '@react-google-maps/api'
import { WebSocketLink } from '@apollo/client/link/ws'
import 'firebase/messaging'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import {
  GOOGLE_MAPS_KEY,
  SERVER_URL,
  WS_SERVER_URL,
  SENTRY_DSN
} from './config/constants'
import App from './app'
import { RestProvider } from './context/Restaurant'
import { ThemeProvider, StyledEngineProvider } from '@mui/material'
import theme from './utils/theme'

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 0.1
})

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

function Main() {
  return (
    <ApolloProvider client={client}>
      <LoadScript
        id="script-loader"
        googleMapsApiKey={GOOGLE_MAPS_KEY}
        libraries={[
          'drawing',
          'places',
          'geometry',
          'localContext',
          'visualization'
        ]}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <RestProvider>
              <App />
            </RestProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </LoadScript>
    </ApolloProvider>
  )
}
ReactDOM.render(<Main />, document.getElementById('root'))
