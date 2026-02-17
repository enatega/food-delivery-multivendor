import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
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
import { Platform } from "react-native";
import { DefinitionNode, FragmentDefinitionNode } from "graphql";
import { Subscription } from "zen-observable-ts";
import { SubscriptionClient } from "subscriptions-transport-ws";
import useEnvVars from "../../environment";
import { RIDER_TOKEN } from "../utils/constants";
import { IRestaurantLocation } from "../utils/interfaces";
import { calculateDistance } from "../utils/methods/custom-functions";
import { getValidPublicToken } from "../utils/service/publicAccessService";
import { getOrCreateNonce } from "../utils/publicAccessToken";

const setupApollo = () => {
  const { GRAPHQL_URL, WS_GRAPHQL_URL } = useEnvVars();

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
          freeDelivery: {
            read(/* _existing: IRestaurantLocation */) {
              const randomValue = Math.random() * 10;
              return randomValue > 5;
            },
          },
          acceptVouchers: {
            read(/* _existing: IRestaurantLocation */) {
              const randomValue = Math.random() * 10;
              return randomValue < 5;
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
        const token = await AsyncStorage.getItem(RIDER_TOKEN);
        const publicToken = await getValidPublicToken(
          GRAPHQL_URL ?? "https://aws-server-v2.enatega.com/graphql"
        ).catch((err) => {
          console.log("⚠️ Could not get public token for WebSocket:", err.message);
          return null;
        });
        const nonce = await getOrCreateNonce();

        console.log("🔌 WebSocket connecting with user token:", token ? "✓" : "✗");
        console.log("🔌 WebSocket connecting with public token:", publicToken ? "✓" : "✗");

        return {
          authorization: token ? `Bearer ${token}` : "",
          "bop-auth": publicToken ? `Bearer ${publicToken}` : "",
          nonce: nonce,
        };
      },
      connectionCallback: (error) => {
        if (error) {
          console.error("❌ WebSocket connection error:", error);
        } else {
          console.log("✅ WebSocket connected successfully");
        }
      },
    },
    WebSocket
  );

  // Add event listeners for debugging (can be removed in production)
  wsClient.onConnected(() => {
    console.log("✅ WebSocket connected");
  });

  wsClient.onReconnected(() => {
    console.log("🔄 WebSocket reconnected");
  });

  const wsLink = new WebSocketLink(wsClient);

  const request = async (operation: Operation) => {
    const token = await AsyncStorage.getItem(RIDER_TOKEN);

    // Try to get public token, but don't fail if it's not available yet
    const publicToken = await getValidPublicToken(
      GRAPHQL_URL ?? "https://aws-server-v2.enatega.com/graphql"
    ).catch((err) => {
      console.log("⚠️ Could not get public token for request:", err.message);
      return null;
    });

    const nonce = await getOrCreateNonce();

    // Get platform-specific information for fingerprinting
    const platform = Platform.OS;
    const locale = (await AsyncStorage.getItem("lang")) || "en";

    // Build headers object
    const headers: Record<string, string> = {
      authorization: token ? `Bearer ${token}` : "",
      nonce: nonce,
      "x-platform": platform,
      "accept-language": locale,
      "user-agent": `Yalla-Rider-App/${platform}`,
    };

    // Add bop-auth if we have a public token
    if (publicToken) {
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
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
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
          console.log("❌ User authentication failed, removing rider token");
          AsyncStorage.removeItem(RIDER_TOKEN)
            .then(() => {})
            .catch((err) => console.log(err));
        }

        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        );
      });
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
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

  return client;
};

export default setupApollo;
