// Environment
// import getEnv from "@/environment";

// Apollo
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
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

// GQL
import { SubscriptionClient } from "subscriptions-transport-ws";
import { useEffect, useRef } from "react";

// Utility imports
import { Subscription } from "zen-observable-ts";
// import { ENV } from "../utils/constants";

import {
  initializeNonce,
  getNonce,
  storeMetricsToken,
  getMetricsToken,
  shouldRefreshToken,
} from '../utils/methods/security';
import { METRICS_GENERAL } from '../api/graphql/mutations/metrics';
import { print } from 'graphql';
import { getAccessToken, invalidateClientSession } from '../utils/methods/auth';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let isAuthRedirecting = false;

function handleInvalidSession(): void {
  if (typeof window === "undefined" || isAuthRedirecting) return;
  isAuthRedirecting = true;
  invalidateClientSession();
  window.location.assign("/auth/login");
}

async function fetchMetricsToken(serverUrl?: string): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const nonce = getNonce();
      const response = await fetch(`${serverUrl}graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          nonce: nonce || '',
        },
        body: JSON.stringify({
          query: print(METRICS_GENERAL),
        }),
      });

      const result = await response.json();
      if (result.data?.metricsGeneral) {
        const { experience, hehe } = result.data.metricsGeneral;
        storeMetricsToken(experience, hehe);
        return experience;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch metrics token:', error);
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export const useSetupApollo = (): ApolloClient<NormalizedCacheObject> => {
  const clientRef = useRef<ApolloClient<NormalizedCacheObject> | null>(null);
  const wsClientRef = useRef<SubscriptionClient | null>(null);

  useEffect(() => {
    return () => {
      wsClientRef.current?.close(false, false);
      wsClientRef.current = null;
      clientRef.current = null;
    };
  }, []);

  if (clientRef.current) {
    return clientRef.current;
  }

  // const { SERVER_URL, WS_SERVER_URL } = getEnv(ENV);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  const WS_SERVER_URL = process.env.NEXT_PUBLIC_WS_SERVER_URL;

  initializeNonce();

  const cache = new InMemoryCache();

  const httpLink = createHttpLink({
    uri: `${SERVER_URL}graphql`,
    // useGETForQueries: true, 
  });

  // WebSocketLink with error handling
  const wsClient = new SubscriptionClient(`${WS_SERVER_URL}graphql`, {
      reconnect: true,
      timeout: 30000,
      lazy: true,
      connectionParams: () => ({
        authorization: getAccessToken() ? `Bearer ${getAccessToken()}` : '',
      }),
    });
  wsClientRef.current = wsClient;
  const wsLink = new WebSocketLink(wsClient);

  const errorLink = new ApolloLink((operation, forward) =>
    new Observable((observer) => {
      let subscription: Subscription | undefined;

      const run = () => {
        subscription = forward(operation).subscribe({
          next: observer.next.bind(observer),
          complete: observer.complete.bind(observer),
          error: (error) => {
            const graphQLErrors = error?.graphQLErrors ?? [];
            const hasInvalidSession = graphQLErrors.some(
              (graphQLError: { extensions?: { code?: string } }) =>
                graphQLError.extensions?.code === "TOKEN_EXPIRED" ||
                graphQLError.extensions?.code === "INVALID_TOKEN",
            );

            if (hasInvalidSession) {
              handleInvalidSession();
            }

            observer.error(error);
          },
        });
      };

      run();
      return () => subscription?.unsubscribe();
    })
  );

  const request = async (operation: Operation): Promise<void> => {
    const token = getAccessToken();
    const userId = typeof window === 'undefined' ? '' : localStorage.getItem('userId');
    const operationName = operation.operationName;
    if (operationName !== 'MetricsGeneral' && shouldRefreshToken()) {
      await fetchMetricsToken(SERVER_URL);
    }

    const nonce = getNonce();
    const metricsToken = getMetricsToken();
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
        nonce: nonce || '',
        'bop-auth': metricsToken ? `Bearer ${metricsToken}` : '',
        userId: userId ?? "",
        isAuth: !!token,
        "X-Client-Type": "web"
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
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  }, wsLink);

  const client = new ApolloClient({
    link: concat(
      ApolloLink.from([errorLink, terminatingLink, requestLink]),
      httpLink
    ),
    cache,
    connectToDevTools: process.env.NODE_ENV !== "production",
  });

  clientRef.current = client;
  return client;
};
