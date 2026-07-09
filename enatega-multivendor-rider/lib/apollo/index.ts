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
import { Platform } from "react-native";
import { DefinitionNode, FragmentDefinitionNode } from "graphql";
import { Subscription } from "zen-observable-ts";
import { SubscriptionClient } from "subscriptions-transport-ws";
import useEnvVars from "../../environment";
import { RIDER_ID, RIDER_TOKEN } from "../utils/constants";
import { getSecureItem, removeSecureItem } from "../services/secure-storage";
import { IRestaurantLocation } from "../utils/interfaces";
import { calculateDistance } from "../utils/methods/custom-functions";
import PublicAccessTokenService from "../services/public-access-token.service";

let isAuthRedirecting = false;

async function handleInvalidSession(): Promise<void> {
  if (isAuthRedirecting) return;
  isAuthRedirecting = true;

  try {
    await Promise.all([
      removeSecureItem(RIDER_TOKEN),
      AsyncStorage.removeItem(RIDER_ID),
    ]);
    router.replace("/login");
  } finally {
    setTimeout(() => {
      isAuthRedirecting = false;
    }, 1000);
  }
}

// The whole app must share a single client (one cache, one WS connection),
// so the client is created once and reused on subsequent calls.
let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const setupApollo = () => {
  // useEnvVars uses useContext, so it must run on every render to keep hook
  // order stable — only the client construction below is skipped when cached.
  const { GRAPHQL_URL, WS_GRAPHQL_URL } = useEnvVars();

  if (apolloClient) {
    return apolloClient;
  }

  const cache = new InMemoryCache({
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
      // Some legacy order items come back without an `image` field (undefined
      // rather than null). A `read` policy marks the field optional, which
      // silences the "Missing field 'image'" cache warnings and normalizes the
      // absent value to null.
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
              )
                return;
              const distance = calculateDistance(
                restaurantLocation.coordinates[0][0][0],
                restaurantLocation.coordinates[0][0][1],
                variables?.latitude,
                variables?.longitude,
              );
              return distance;
            },
          },
        },
      },
    },
  });

  const httpLink = createHttpLink({
    uri: GRAPHQL_URL,
  });

  const wsClient = new SubscriptionClient(
    WS_GRAPHQL_URL,
    {
      reconnect: true,
      lazy: true,
      connectionParams: async () => {
        const token = await getSecureItem(RIDER_TOKEN);
        const nonce = PublicAccessTokenService.getNonce();
        let publicToken: string | null = null;

        try {
          publicToken = await PublicAccessTokenService.getToken(client);
        } catch {
          publicToken = null;
        }

        return {
          authorization: token ? `Bearer ${token}` : "",
          "bop-auth": publicToken ? `Bearer ${publicToken}` : "",
          nonce: nonce || "",
        };
      },
      connectionCallback: (error) => {
        if (error && __DEV__) {
          console.warn("WebSocket connection error");
        }
      },
    },
    WebSocket
  );

  const wsLink = new WebSocketLink(wsClient);

  const request = async (operation: Operation) => {
    const skipPublicAuth =
      operation.getContext().headers?.["x-skip-public-auth"];
    const token = await getSecureItem(RIDER_TOKEN);
    const nonce = PublicAccessTokenService.getNonce();

    // Get platform-specific information for fingerprinting
    const platform = Platform.OS;
    const locale = (await AsyncStorage.getItem("lang")) || "en";

    // Build headers object
    const headers: Record<string, string> = {
      authorization: token ? `Bearer ${token}` : "",
      nonce: nonce || "",
      "x-platform": platform,
      "accept-language": locale,
      "user-agent": `Yalla-Rider-App/${platform}`,
      ...operation.getContext().headers,
    };

    if (!skipPublicAuth) {
      const publicToken = await PublicAccessTokenService.getToken(client);
      headers["bop-auth"] = `Bearer ${publicToken}`;
    }

    operation.setContext({
      headers,
    });
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
    const hasInvalidSession = (graphQLErrors || []).some(
      (graphQLError) =>
        graphQLError?.extensions?.code === "TOKEN_EXPIRED" ||
        graphQLError?.extensions?.code === "INVALID_TOKEN",
    );

    if (hasInvalidSession) {
      void handleInvalidSession();
      return;
    }

    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        // IMPORTANT: Only remove user token for actual user auth failures
        // Do NOT remove token for public auth failures (bop-auth related)
        const isPublicAuthError =
          message.toLowerCase().includes("fingerprint mismatch") ||
          message.toLowerCase().includes("token expired") ||
          message.toLowerCase().includes("invalid token") ||
          message.toLowerCase().includes("token missing");

        // Only remove rider token if it's a user auth error (not public auth error)
        if (
          !isPublicAuthError &&
          (message.toLowerCase().includes("unauthenticate") ||
           message.toLowerCase().includes("unauthorize"))
        ) {
          removeSecureItem(RIDER_TOKEN)
            .then(() => {})
            .catch(() => {});
        }
      });
    }
    if (networkError && __DEV__) {
      console.warn("Network error while processing GraphQL request");
    }
  });

  const client = new ApolloClient({
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
        httpLink
      ),
    ]),
    cache,
    resolvers: {},
  });

  apolloClient = client;
  return client;
};

export default setupApollo;
