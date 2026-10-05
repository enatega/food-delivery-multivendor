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

// Utility imports
import { Subscription } from "zen-observable-ts";
// import { ENV } from "../utils/constants";

import {
  initializeNonce,
  getNonce,
  storeMetricsToken,
  getMetricsToken,
  shouldRefreshToken,
} from "../utils/methods/security";
import { METRICS_GENERAL } from "../api/graphql/mutations/metrics";
import { print } from "graphql";
import { getAccessToken, invalidateClientSession } from "../utils/methods/auth";
import { getModeEnvironment, useAppMode, type AppMode } from "@/lib/mode";

const refreshPromises = new Map<AppMode, Promise<string | null>>();
let isAuthRedirecting = false;

function getOperationMode(
  operation: Operation,
  fallbackMode: AppMode,
): AppMode {
  return operation.getContext().appMode ?? fallbackMode;
}

function handleInvalidSession(mode: AppMode): void {
  if (typeof window === "undefined" || isAuthRedirecting) return;
  isAuthRedirecting = true;
  invalidateClientSession(mode);
  window.location.assign("/auth/login");
}

async function fetchMetricsToken(
  serverUrl: string,
  mode: AppMode,
): Promise<string | null> {
  const existing = refreshPromises.get(mode);
  if (existing) return existing;
  const refreshPromise = (async () => {
    try {
      const nonce = getNonce(mode);
      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          nonce: nonce || "",
        },
        body: JSON.stringify({
          query: print(METRICS_GENERAL),
        }),
      });

      const result = await response.json();
      if (result.data?.metricsGeneral) {
        const { experience, hehe } = result.data.metricsGeneral;
        storeMetricsToken(experience, hehe, mode);
        return experience;
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch metrics token:", error);
      return null;
    } finally {
      refreshPromises.delete(mode);
    }
  })();

  refreshPromises.set(mode, refreshPromise);
  return refreshPromise;
}

// One client per mode for the lifetime of the tab. Switching vendor mode
// remounts the provider tree, so reusing the client keeps its cache: going
// back to a mode renders instantly from cache while queries refresh, and data
// prefetched for the inactive mode is already there when the user switches.
const clientsByMode = new Map<AppMode, ApolloClient<NormalizedCacheObject>>();

export const getApolloClient = (
  mode: AppMode,
): ApolloClient<NormalizedCacheObject> => {
  // Never share a cache between server requests.
  if (typeof window === "undefined") return createApolloClient(mode);
  let client = clientsByMode.get(mode);
  if (!client) {
    client = createApolloClient(mode);
    clientsByMode.set(mode, client);
  }
  return client;
};

export const useSetupApollo = (): ApolloClient<NormalizedCacheObject> => {
  const { mode } = useAppMode();
  return getApolloClient(mode);
};

function createApolloClient(
  mode: AppMode,
): ApolloClient<NormalizedCacheObject> {
  const environment = getModeEnvironment(mode);

  // const { SERVER_URL, WS_SERVER_URL } = getEnv(ENV);
  const SERVER_URL = environment.graphqlUrl;
  const WS_SERVER_URL = environment.websocketUrl;

  initializeNonce(mode);

  const cache = new InMemoryCache();

  const httpLink = createHttpLink({
    uri: (operation) =>
      getModeEnvironment(getOperationMode(operation, mode)).graphqlUrl,
    // useGETForQueries: true,
  });

  // WebSocketLink with error handling
  const wsClient = new SubscriptionClient(WS_SERVER_URL, {
    reconnect: true,
    timeout: 30000,
    lazy: true,
    // The client outlives mode switches, so let an idle socket close.
    inactivityTimeout: 30000,
    connectionParams: () => ({
      authorization: getAccessToken(mode)
        ? `Bearer ${getAccessToken(mode)}`
        : "",
    }),
  });
  const wsLink = new WebSocketLink(wsClient);

  const errorLink = new ApolloLink(
    (operation, forward) =>
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
                handleInvalidSession(getOperationMode(operation, mode));
              }

              observer.error(error);
            },
          });
        };

        run();
        return () => subscription?.unsubscribe();
      }),
  );

  const request = async (operation: Operation): Promise<void> => {
    const operationMode = getOperationMode(operation, mode);
    const operationServerUrl = getModeEnvironment(operationMode).graphqlUrl;
    initializeNonce(operationMode);
    const token = getAccessToken(operationMode);
    const userId =
      typeof window === "undefined"
        ? ""
        : localStorage.getItem(
            `@enatega/${operationMode.toLowerCase()}/userId`,
          );
    const operationName = operation.operationName;
    if (
      operationName !== "MetricsGeneral" &&
      shouldRefreshToken(operationMode)
    ) {
      await fetchMetricsToken(operationServerUrl, operationMode);
    }

    const nonce = getNonce(operationMode);
    const metricsToken = getMetricsToken(operationMode);
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
        nonce: nonce || "",
        "bop-auth": metricsToken ? `Bearer ${metricsToken}` : "",
        userId: userId ?? "",
        isAuth: !!token,
        "X-Client-Type": "web",
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
      }),
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
      httpLink,
    ),
    cache,
    connectToDevTools: process.env.NODE_ENV !== "production",
  });

  return client;
}
