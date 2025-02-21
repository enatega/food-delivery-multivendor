import { useConfiguration } from '@/lib/hooks/useConfiguration';
import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  Operation,
  split,
} from '@apollo/client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from '@apollo/client/link/error'; // Import onError utility

// Utility imports
import { Subscription } from 'zen-observable-ts';
import { APP_NAME } from '../utils/constants';

export const useSetupApollo = (): ApolloClient<NormalizedCacheObject> => {
  const { SERVER_URL, WS_SERVER_URL } = useConfiguration();

  const cache = new InMemoryCache();

  const httpLink = createHttpLink({
    uri: `${SERVER_URL}graphql`,
  });

  // WebSocketLink with error handling
  const wsLink = new WebSocketLink(
    new SubscriptionClient(`${WS_SERVER_URL}graphql`, {
      reconnect: true,
      timeout: 30000,
      lazy: true,
    })
  );

  // Error Handling Link using ApolloLink's onError (for network errors)
  const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (networkError) {
      console.error('Network Error:', networkError);
    }

    if (graphQLErrors) {
      graphQLErrors.forEach((error) =>
        console.error('GraphQL Error:', error.message)
      );
    }
  });

  const request = async (operation: Operation): Promise<void> => {
    const data = localStorage.getItem(`user-${APP_NAME}`);
    let token = '';
    if (data) {
      token = JSON.parse(data).token;
    }

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  };

  // Request Link
  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle: Subscription | undefined;
        Promise.resolve(operation)
          .then((oper) => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );

  // Terminating Link for split between HTTP and WebSocket
  const terminatingLink = split(({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  }, wsLink);

  const client = new ApolloClient({
    link: concat(
      ApolloLink.from([errorLink, terminatingLink, requestLink]),
      httpLink
    ),
    cache,
    connectToDevTools: true,
  });

  return client;
};
