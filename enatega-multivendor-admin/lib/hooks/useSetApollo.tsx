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
import { useEffect, useRef } from 'react';

// Utility imports
import { Subscription } from 'zen-observable-ts';


import { METRICS_GENERAL } from '../api/graphql/mutations/metrics';
import { REFRESH_TOKEN } from '../api/graphql/mutations/authentication/refresh';
import { print } from 'graphql';
import {
  clearMetricsData,
  getMetricsToken,
  getNonce,
  initializeNonce,
  shouldRefreshToken,
  storeMetricsToken,
} from '../utils/methods/security';
import {
  clearStoredSessionState,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  getUserType,
  setAuthTokens,
  setStoredUser,
} from '../utils/methods/auth';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let accessTokenRefreshPromise: Promise<string | null> | null = null;
let isAuthRedirecting = false;

type GraphQLErrorLike = {
  message?: string;
  extensions?: { code?: string };
};

function getGraphQLErrors(error: unknown): GraphQLErrorLike[] {
  if (typeof error !== 'object' || error === null) return [];

  const graphQLErrors =
    'graphQLErrors' in error && Array.isArray(error.graphQLErrors)
      ? (error.graphQLErrors as GraphQLErrorLike[])
      : [];
  const errors =
    'errors' in error && Array.isArray(error.errors)
      ? (error.errors as GraphQLErrorLike[])
      : [];
  const resultErrors =
    'result' in error &&
    typeof error.result === 'object' &&
    error.result !== null &&
    'errors' in error.result &&
    Array.isArray(error.result.errors)
      ? (error.result.errors as GraphQLErrorLike[])
      : [];

  return [...graphQLErrors, ...errors, ...resultErrors];
}

function isMetricsAuthError(error: unknown): boolean {
  return getGraphQLErrors(error).some((graphQLError) => {
    const message = graphQLError.message?.toLowerCase() ?? '';
    return (
      message.includes('fingerprint mismatch') ||
      message.includes('nonce header missing') ||
      message.includes('token missing') ||
      message.includes('unauthorized: invalid token') ||
      message.includes('unauthorized: jwt expired')
    );
  });
}

function hasAuthError(error: unknown, codes: string[]): boolean {
  const normalizedCodes = new Set(codes);
  return getGraphQLErrors(error).some((graphQLError) =>
    normalizedCodes.has(graphQLError.extensions?.code ?? '')
  );
}

function hasMessage(error: unknown, value: string): boolean {
  return getGraphQLErrors(error).some((graphQLError) =>
    (graphQLError.message ?? '').toLowerCase().includes(value)
  );
}

function hasExpiredAccessToken(error: unknown): boolean {
  return (
    hasAuthError(error, ['TOKEN_EXPIRED']) ||
    hasMessage(error, 'access token expired')
  );
}

function hasInvalidAccessToken(error: unknown): boolean {
  return (
    hasAuthError(error, ['INVALID_TOKEN']) ||
    getGraphQLErrors(error).some(
      (graphQLError) =>
        (graphQLError.message ?? '').trim().toLowerCase() === 'invalid token'
    )
  );
}

function isOperationAlreadyRetried(operation: Operation, key: string): boolean {
  return Boolean(operation.getContext()[key]);
}

function markOperationRetried(operation: Operation, key: string): void {
  operation.setContext({ [key]: true });
}

function isGraphQLResponseError(result: unknown): result is {
  errors: GraphQLErrorLike[];
} {
  return (
    typeof result === 'object' &&
    result !== null &&
    'errors' in result &&
    Array.isArray(result.errors) &&
    result.errors.length > 0
  );
}

function handleInvalidSession(): void {
  if (typeof window === 'undefined' || isAuthRedirecting) return;
  isAuthRedirecting = true;
  clearStoredSessionState();
  clearMetricsData();
  window.location.assign('/authentication/login');
}

async function fetchMetricsToken(serverUrl?: string): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      if (!serverUrl) {
        throw new Error('NEXT_PUBLIC_SERVER_URL is not configured');
      }

      const nonce = getNonce();
      const response = await fetch(`${serverUrl}graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          nonce: nonce || '',
          'x-platform': 'web',
          'X-Client-Type': 'web',
        },
        body: JSON.stringify({
          query: print(METRICS_GENERAL),
        }),
      });

      const result = await response.json();
      if (!response.ok || isGraphQLResponseError(result)) {
        const message = isGraphQLResponseError(result)
          ? result.errors[0]?.message
          : `Metrics request failed with status ${response.status}`;
        throw new Error(message || 'Unable to initialize request security');
      }

      if (result.data?.metricsGeneral) {
        const { experience, hehe } = result.data.metricsGeneral;

        if (nonce !== getNonce()) {
          return null;
        }

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

async function refreshAccessToken(serverUrl?: string): Promise<string | null> {
  if (accessTokenRefreshPromise) {
    return accessTokenRefreshPromise;
  }

  accessTokenRefreshPromise = (async () => {
    try {
      if (!serverUrl) return null;

      const refreshToken = getRefreshToken();
      const userType = getUserType();
      if (!refreshToken || !userType) return null;

      if (shouldRefreshToken()) {
        await fetchMetricsToken(serverUrl);
      }

      const executeRefresh = async () => {
        const response = await fetch(`${serverUrl}graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            nonce: getNonce() || '',
            'bop-auth': getMetricsToken()
              ? `Bearer ${getMetricsToken()}`
              : '',
            'x-platform': 'web',
            'X-Client-Type': 'web',
          },
          body: JSON.stringify({
            query: print(REFRESH_TOKEN),
            variables: { refreshToken, userType },
          }),
        });

        return {
          response,
          result: await response.json(),
        };
      };

      let { response, result } = await executeRefresh();
      if (isMetricsAuthError(result)) {
        clearMetricsData();
        initializeNonce();
        const metricsToken = await fetchMetricsToken(serverUrl);
        if (!metricsToken) return null;
        ({ response, result } = await executeRefresh());
      }

      const refreshedSession = result.data?.refreshToken;

      if (!response.ok || isGraphQLResponseError(result) || !refreshedSession?.token) {
        return null;
      }

      setAuthTokens(refreshedSession);
      const storedUser = getStoredUser();
      if (storedUser) {
        setStoredUser({
          ...storedUser,
          ...refreshedSession,
        });
      }

      return refreshedSession.token as string;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      return null;
    } finally {
      accessTokenRefreshPromise = null;
    }
  })();

  return accessTokenRefreshPromise;
}

export const useSetupApollo = (): ApolloClient<NormalizedCacheObject> => {
  const clientRef = useRef<ApolloClient<NormalizedCacheObject> | null>(null);
  const wsClientRef = useRef<SubscriptionClient | null>(null);

  useEffect(() => {
    if (shouldRefreshToken()) {
      void fetchMetricsToken(process.env.NEXT_PUBLIC_SERVER_URL);
    }

    return () => {
      wsClientRef.current?.close(false, false);
      wsClientRef.current = null;
      clientRef.current = null;
    };
  }, []);

  if (clientRef.current) {
    return clientRef.current;
  }

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  const WS_SERVER_URL = process.env.NEXT_PUBLIC_WS_SERVER_URL;

  initializeNonce();

  const cache = new InMemoryCache();

  const httpLink = createHttpLink({
    uri: `${SERVER_URL}graphql`,
  });

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
      let handle: Subscription | undefined;

      const run = () => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          complete: observer.complete.bind(observer),
          error: async (error) => {
            if (
              hasExpiredAccessToken(error) &&
              !isOperationAlreadyRetried(operation, 'accessTokenRetry')
            ) {
              markOperationRetried(operation, 'accessTokenRetry');
              const refreshedToken = await refreshAccessToken(SERVER_URL);

              if (refreshedToken) {
                run();
                return;
              }
            }

            if (
              hasExpiredAccessToken(error) ||
              hasInvalidAccessToken(error)
            ) {
              handleInvalidSession();
            }

            observer.error(error);
          },
        });
      };

      run();
      return () => handle?.unsubscribe();
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
        authorization: token ? `Bearer ${token}` : '',
        nonce: nonce || '',
        'bop-auth': metricsToken ? `Bearer ${metricsToken}` : '',
        userId: userId ?? '',
        isAuth: !!token,
        'X-Client-Type': 'web',
        'x-platform': 'web',
      },
    });
  };

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle: Subscription | undefined;

        const retryWithFreshMetricsToken = async (): Promise<boolean> => {
          if (
            operation.operationName === 'MetricsGeneral' ||
            isOperationAlreadyRetried(operation, 'metricsTokenRetry')
          ) {
            return false;
          }

          markOperationRetried(operation, 'metricsTokenRetry');
          clearMetricsData();
          initializeNonce();
          const metricsToken = await fetchMetricsToken(SERVER_URL);
          if (!metricsToken) return false;

          await request(operation);
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
          return true;
        };

        Promise.resolve(operation)
          .then((oper) => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: async (result) => {
                if (
                  isMetricsAuthError(result) &&
                  (await retryWithFreshMetricsToken())
                ) {
                  return;
                }

                observer.next(result);
              },
              error: async (error) => {
                if (
                  isMetricsAuthError(error) &&
                  (await retryWithFreshMetricsToken())
                ) {
                  return;
                }

                observer.error(error);
              },
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );

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
    connectToDevTools: process.env.NODE_ENV !== 'production',
  });

  clientRef.current = client;
  return client;
};
