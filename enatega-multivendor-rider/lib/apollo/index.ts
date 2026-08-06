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
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import {
  getMainDefinition,
  offsetLimitPagination,
} from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { DefinitionNode, FragmentDefinitionNode } from "graphql";
import { Platform } from "react-native";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { Subscription } from "zen-observable-ts";

import { RiderEnvironment } from "@/environment";
import PublicAccessTokenService from "@/lib/services/public-access-token.service";
import { getSecureItem, removeSecureItem } from "@/lib/services/secure-storage";
import { IRestaurantLocation } from "@/lib/utils/interfaces";
import { calculateDistance } from "@/lib/utils/methods/custom-functions";

interface SetupApolloOptions {
  environment: RiderEnvironment;
  riderIdKey: string;
  tokenKey: string;
}

export interface ApolloRuntime {
  client: ApolloClient<NormalizedCacheObject>;
  dispose: () => void;
}

let isAuthRedirecting = false;

function createCache() {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          _id: {
            keyArgs: ["string"],
          },
          orders: offsetLimitPagination(),
        },
      },
      Category: {
        fields: {
          foods: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      Food: {
        fields: {
          variations: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      Item: {
        fields: {
          image: {
            read(existing = null) {
              return existing;
            },
          },
        },
      },
      RestaurantPreview: {
        fields: {
          distanceWithCurrentLocation: {
            read(_existing: IRestaurantLocation, { variables, readField }) {
              const restaurantLocation: IRestaurantLocation | undefined =
                readField("location");
              if (
                !restaurantLocation?.coordinates[0] ||
                !restaurantLocation?.coordinates[1]
              ) {
                return;
              }
              return calculateDistance(
                restaurantLocation.coordinates[0][0][0],
                restaurantLocation.coordinates[0][0][1],
                variables?.latitude,
                variables?.longitude,
              );
            },
          },
        },
      },
    },
  });
}

export default function setupApollo({
  environment,
  riderIdKey,
  tokenKey,
}: SetupApolloOptions): ApolloRuntime {
  const { GRAPHQL_URL, PUBLIC_ACCESS_REQUIRED, WS_GRAPHQL_URL } = environment;
  const cache = createCache();
  const httpLink = createHttpLink({ uri: GRAPHQL_URL });

  const handleInvalidSession = async () => {
    if (isAuthRedirecting) return;
    isAuthRedirecting = true;
    try {
      await Promise.all([removeSecureItem(tokenKey), removeSecureItem(riderIdKey)]);
      router.replace("/login");
    } finally {
      setTimeout(() => {
        isAuthRedirecting = false;
      }, 1000);
    }
  };

  const wsClient = new SubscriptionClient(
    WS_GRAPHQL_URL,
    {
      reconnect: true,
      lazy: true,
      connectionParams: async () => {
        const token = await getSecureItem(tokenKey);
        const headers: Record<string, string> = {
          authorization: token ? `Bearer ${token}` : "",
        };

        if (PUBLIC_ACCESS_REQUIRED) {
          const nonce = PublicAccessTokenService.getNonce();
          let publicToken: string | null = null;
          try {
            publicToken = await PublicAccessTokenService.getToken(client);
          } catch {
            publicToken = null;
          }
          headers["bop-auth"] = publicToken ? `Bearer ${publicToken}` : "";
          headers.nonce = nonce || "";
        }

        return headers;
      },
      connectionCallback: (error) => {
        if (error && __DEV__) {
          console.warn("WebSocket connection error");
        }
      },
    },
    WebSocket,
  );

  const request = async (operation: Operation) => {
    const token = await getSecureItem(tokenKey);
    const locale = (await AsyncStorage.getItem("lang")) || "en";
    const headers: Record<string, string> = {
      authorization: token ? `Bearer ${token}` : "",
      "x-platform": Platform.OS,
      "accept-language": locale,
      "user-agent": `Enatega-Rider-App/${Platform.OS}`,
      ...operation.getContext().headers,
    };

    const skipPublicAuth =
      operation.getContext().headers?.["x-skip-public-auth"];
    if (PUBLIC_ACCESS_REQUIRED && !skipPublicAuth) {
      const publicToken = await PublicAccessTokenService.getToken(client);
      headers["bop-auth"] = publicToken ? `Bearer ${publicToken}` : "";
      headers.nonce = PublicAccessTokenService.getNonce() || "";
    }

    operation.setContext({ headers });
  };

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle: Subscription | undefined;
        void request(operation)
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => handle?.unsubscribe();
      }),
  );

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    const hasInvalidSession = (graphQLErrors || []).some((error) => {
      const code = error?.extensions?.code;
      const message = error.message.toLowerCase();
      const isPublicAuthError =
        PUBLIC_ACCESS_REQUIRED &&
        (message.includes("fingerprint") ||
          message.includes("public token") ||
          message.includes("bop-auth") ||
          message.includes("nonce"));
      return (
        !isPublicAuthError &&
        (code === "TOKEN_EXPIRED" ||
          code === "INVALID_TOKEN" ||
          message.includes("unauthenticated") ||
          message.includes("unauthorized"))
      );
    });

    if (hasInvalidSession) {
      void handleInvalidSession();
    } else if (networkError && __DEV__) {
      console.warn("Network error while processing GraphQL request");
    }
  });

  const wsLink = new WebSocketLink(wsClient);
  const client = new ApolloClient({
    cache,
    link: ApolloLink.from([
      errorLink,
      requestLink,
      split(
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
      ),
    ]),
  });

  return {
    client,
    dispose: () => {
      wsClient.close(false, true);
      client.stop();
    },
  };
}
