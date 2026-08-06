import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  Operation,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

import { StoreEnvironment } from "@/environment";
import * as SecureStore from "expo-secure-store";
import { onError } from "@apollo/client/link/error";
import { router } from "expo-router";
import { DefinitionNode, FragmentDefinitionNode } from "graphql";
import { Subscription } from "zen-observable-ts";
import PublicAccessTokenService from "../services/public-access-token.service";

let isAuthRedirecting = false;

const isExpiredJwt = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const payload = JSON.parse(globalThis.atob(token.split(".")[1]));
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now() + 15000;
  } catch {
    return true;
  }
};

interface ApolloSetupOptions {
  environment: StoreEnvironment;
  tokenKey: string;
  storeIdKey: string;
}

async function handleInvalidSession(
  tokenKey: string,
  storeIdKey: string,
): Promise<void> {
  if (isAuthRedirecting) return;
  isAuthRedirecting = true;

  try {
    await Promise.all([
      SecureStore.deleteItemAsync(tokenKey),
      SecureStore.deleteItemAsync(storeIdKey),
    ]);
    router.replace("/(un-protected)/login");
  } finally {
    setTimeout(() => {
      isAuthRedirecting = false;
    }, 1000);
  }
}

const setupApollo = ({
  environment,
  tokenKey,
  storeIdKey,
}: ApolloSetupOptions) => {
  const { GRAPHQL_URL, WS_GRAPHQL_URL, PUBLIC_ACCESS_REQUIRED } = environment;

  const cache = new InMemoryCache(); // eslint-disable-next-line new-cap
  const httpLink = createHttpLink({
    uri: GRAPHQL_URL,
  });

  // Authenticate the subscription WebSocket the same way HTTP requests are
  // authenticated. Without connectionParams the socket connects anonymously
  // and the server rejects `subscribePlaceOrder` (ensureRestaurantAccess),
  // silently falling back to polling. connectionParams is evaluated on every
  // (re)connect, so a fresh token is always sent.
  const wsLink = new WebSocketLink({
    uri: WS_GRAPHQL_URL,
    options: {
      reconnect: true,
      lazy: true,
      timeout: 30000,
      connectionParams: async () => {
        const token = await SecureStore.getItemAsync(tokenKey);
        if (isExpiredJwt(token)) {
          await handleInvalidSession(tokenKey, storeIdKey);
          return {authorization: "", "x-platform": "mobile"};
        }
        const params: Record<string, string> = {
          authorization: token ? `Bearer ${token}` : "",
          "x-platform": "mobile",
        };

        if (PUBLIC_ACCESS_REQUIRED) {
          const nonce = PublicAccessTokenService.getNonce();
          let publicToken: string | null = null;
          try {
            publicToken = await PublicAccessTokenService.getToken(client);
          } catch {
            publicToken = null;
          }
          params.nonce = nonce || "";
          params["bop-auth"] = publicToken ? `Bearer ${publicToken}` : "";
        }

        return params;
      },
    },
  });

  const request = async (operation: Operation) => {
    const skipPublicAuth =
      operation.getContext().headers?.["x-skip-public-auth"];
    const token = await SecureStore.getItemAsync(tokenKey);
    if (isExpiredJwt(token)) {
      await handleInvalidSession(tokenKey, storeIdKey);
      throw new Error("Session expired");
    }

    const headers: Record<string, string> = {
      authorization: token ? `Bearer ${token}` : "",
      "x-platform": "mobile",
      ...operation.getContext().headers,
    };

    if (PUBLIC_ACCESS_REQUIRED && !skipPublicAuth) {
      const nonce = PublicAccessTokenService.getNonce();
      const publicToken = await PublicAccessTokenService.getToken(client);
      headers.nonce = nonce || "";
      headers["bop-auth"] = publicToken ? `Bearer ${publicToken}` : "";
    }

    operation.setContext({ headers });
  };

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle: Subscription;
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

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    const invalidCodes = ["TOKEN_EXPIRED", "INVALID_TOKEN", "UNAUTHENTICATED"];
    const hasInvalidSession = (graphQLErrors || []).some(
      (graphQLError) =>
        typeof graphQLError?.extensions?.code === "string" &&
        invalidCodes.includes(graphQLError.extensions.code),
    );
    const isUnauthorizedNetworkError =
      networkError &&
      "statusCode" in networkError &&
      networkError.statusCode === 401;

    if (hasInvalidSession || isUnauthorizedNetworkError) {
      void handleInvalidSession(tokenKey, storeIdKey);
    }
  });

  // const terminatingLink = split(({ query }) => {
  //   const {
  //     kind,
  //     operation,
  //   }: OperationDefinitionNode | FragmentDefinitionNode =
  //     getMainDefinition(query);
  //   return kind === "OperationDefinition" && operation === "subscription";
  // }, wsLink);
  // Terminating Link

  const terminatingLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query) as
        | DefinitionNode
        | (FragmentDefinitionNode & {
            kind: string;
            operation?: string;
          });
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink,
  );

  const link = ApolloLink.from([errorLink, requestLink, terminatingLink]);
  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    link,
    cache,
  });

  Object.assign(client, {
    disposeModeClient: () => {
      const subscriptionClient = (
        wsLink as unknown as {
          subscriptionClient: {
            close: (isForced?: boolean, closedByUser?: boolean) => void;
          };
        }
      ).subscriptionClient;
      subscriptionClient.close(true, true);
      client.stop();
    },
  });

  return client;
};

export const disposeApollo = (
  client: ApolloClient<NormalizedCacheObject> & {
    disposeModeClient?: () => void;
  },
) => {
  client.disposeModeClient?.();
  void client.clearStore();
};

export default setupApollo;
