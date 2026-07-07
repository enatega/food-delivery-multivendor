import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  InMemoryCache,
  Observable,
  Operation,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

import getEnvVars from "@/environment";
import * as SecureStore from "expo-secure-store";
import { onError } from "@apollo/client/link/error";
import { router } from "expo-router";
import { DefinitionNode, FragmentDefinitionNode } from "graphql";
import { Subscription } from "zen-observable-ts";
import { STORE_TOKEN } from "../utils/constants";
import PublicAccessTokenService from "../services/public-access-token.service";

let isAuthRedirecting = false;

async function handleInvalidSession(): Promise<void> {
  if (isAuthRedirecting) return;
  isAuthRedirecting = true;

  try {
    await SecureStore.deleteItemAsync(STORE_TOKEN);
    router.replace("/(un-protected)/login");
  } finally {
    setTimeout(() => {
      isAuthRedirecting = false;
    }, 1000);
  }
}

const setupApollo = () => {
  const { GRAPHQL_URL, WS_GRAPHQL_URL } = getEnvVars();

  const cache = new InMemoryCache(); // eslint-disable-next-line new-cap
  const httpLink = createHttpLink({
    uri: GRAPHQL_URL,
  });

  const client = new ApolloClient({
    link: httpLink,
    cache,
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
        const token = await SecureStore.getItemAsync(STORE_TOKEN);
        const nonce = PublicAccessTokenService.getNonce();
        let publicToken: string | null = null;
        try {
          publicToken = await PublicAccessTokenService.getToken(client);
        } catch {
          publicToken = null;
        }
        return {
          authorization: token ? `Bearer ${token}` : "",
          nonce: nonce || "",
          "bop-auth": publicToken ? `Bearer ${publicToken}` : "",
          "x-platform": "mobile",
        };
      },
    },
  });

  const request = async (operation: Operation) => {
    const skipPublicAuth =
      operation.getContext().headers?.["x-skip-public-auth"];
    const token = await SecureStore.getItemAsync(STORE_TOKEN);
    const nonce = PublicAccessTokenService.getNonce();

    const headers: Record<string, string> = {
      authorization: token ? `Bearer ${token}` : "",
      nonce: nonce || "",
      "x-platform": "mobile",
      ...operation.getContext().headers,
    };

    if (!skipPublicAuth) {
      const publicToken = await PublicAccessTokenService.getToken(client);
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

  const errorLink = onError(({ graphQLErrors }) => {
    const hasInvalidSession = (graphQLErrors || []).some(
      (graphQLError) =>
        graphQLError?.extensions?.code === "TOKEN_EXPIRED" ||
        graphQLError?.extensions?.code === "INVALID_TOKEN",
    );

    if (hasInvalidSession) {
      void handleInvalidSession();
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

  const terminatingLink = split(({ query }) => {
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
  }, wsLink);

  client.setLink(
    concat(ApolloLink.from([errorLink, terminatingLink, requestLink]), httpLink),
  );

  return client;
};

export default setupApollo;
