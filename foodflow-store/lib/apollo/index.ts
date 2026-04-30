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
import { DefinitionNode, FragmentDefinitionNode } from "graphql";
import { Subscription } from "zen-observable-ts";
import { STORE_TOKEN } from "../utils/constants";
import PublicAccessTokenService from "../services/public-access-token.service";

const setupApollo = () => {
  const { GRAPHQL_URL, WS_GRAPHQL_URL } = getEnvVars();

  const wsLink = new WebSocketLink({
    uri: WS_GRAPHQL_URL,
    options: {
      reconnect: true,
      lazy: true,
      timeout: 30000,
    },
  });
  const cache = new InMemoryCache(); // eslint-disable-next-line new-cap
  const httpLink = createHttpLink({
    uri: GRAPHQL_URL,
  });

  const client = new ApolloClient({
    link: httpLink,
    cache,
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
    concat(ApolloLink.from([terminatingLink, requestLink]), httpLink),
  );

  return client;
};

export default setupApollo;
