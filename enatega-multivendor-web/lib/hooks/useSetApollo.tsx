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
import { onError } from "@apollo/client/link/error"; // Import onError utility
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

// GQL
import { SubscriptionClient } from "subscriptions-transport-ws";

// Utility imports
import { Subscription } from "zen-observable-ts";
import { useRef } from "react";
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

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

function isTenantSubdomain(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host !== 'localhost' && host.split('.').length > 1 && host.endsWith('localhost');
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

// Detect tenant slug from subdomain (e.g. "myco" from "myco.localhost:3001")
function getTenantSlug(): string | null {
  if (typeof window === 'undefined') return null;
  const host = window.location.hostname;
  const isSubdomain = host !== 'localhost' && host.split('.').length > 1 && host.endsWith('localhost');
  return isSubdomain ? host.replace(/\.localhost$/, '') : null;
}

function buildApolloClient(): ApolloClient<NormalizedCacheObject> {
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  const WS_SERVER_URL = process.env.NEXT_PUBLIC_WS_SERVER_URL;

  initializeNonce();

  const cache = new InMemoryCache();

  const httpLink = createHttpLink({
    uri: `${SERVER_URL}graphql`,
    // useGETForQueries: true,
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
      console.error("Network Error:", networkError);
    }

    if (graphQLErrors) {
      (graphQLErrors || [])?.forEach((error) => {
        console.error("GraphQL Error:", error?.message);
        if (error.extensions?.code === "UNAUTHENTICATED") {
          if (typeof window !== "undefined") {
            localStorage.clear();
            sessionStorage.clear();
            // On tenant subdomains, don't redirect to / — it causes an
            // auto-redirect loop because Start auto-pushes back to /discovery.
            if (!isTenantSubdomain() && window.location.pathname !== "/") {
              window.location.href = "/";
            }
          }
        }
      });
    }
  });

  const request = async (operation: Operation): Promise<void> => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const operationName = operation.operationName;
    if (operationName !== 'MetricsGeneral' && shouldRefreshToken()) {
      await fetchMetricsToken(SERVER_URL);
    }

    const nonce = getNonce();
    const metricsToken = getMetricsToken();
    const tenantSlug = getTenantSlug();
    operation.setContext({
      headers: {
        authorization: (token ?? "") ? `Bearer ${token ?? ""}` : "",
        nonce: nonce || '',
        'bop-auth': `Bearer ${metricsToken}` || '',
        userId: userId ?? "",
        isAuth: !!token,
        "X-Client-Type": "web",
        ...(tenantSlug ? { "x-tenant-slug": tenantSlug } : {}),
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

  return new ApolloClient({
    link: concat(
      ApolloLink.from([errorLink, terminatingLink, requestLink]),
      httpLink
    ),
    cache,
    connectToDevTools: true,
  });
}

export const useSetupApollo = (): ApolloClient<NormalizedCacheObject> => {
  // Memoize the client — creating a new ApolloClient on every render clears
  // the InMemoryCache and triggers infinite re-queries.
  const clientRef = useRef<ApolloClient<NormalizedCacheObject> | null>(null);
  if (!clientRef.current) {
    clientRef.current = buildApolloClient();
  }
  return clientRef.current;
};
