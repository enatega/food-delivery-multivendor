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
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";

import getEnvVars from "@/environment";
import * as SecureStore from "expo-secure-store";
import { DefinitionNode, FragmentDefinitionNode } from "graphql";
import { Subscription } from "zen-observable-ts";
import { STORE_TOKEN } from "../utils/constants";

const setupApollo = () => {
  const { GRAPHQL_URL, WS_GRAPHQL_URL } = getEnvVars();

  const wsLink = new GraphQLWsLink(
    createClient({
      url: WS_GRAPHQL_URL,
    })
  );
  const cache = new InMemoryCache();
  // eslint-disable-next-line new-cap
  const httpLink = createHttpLink({
    uri: GRAPHQL_URL,
  });

  const request = async (operation: Operation) => {
    const token = await SecureStore.getItemAsync(STORE_TOKEN);

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
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

  const client = new ApolloClient({
    link: concat(ApolloLink.from([terminatingLink, requestLink]), httpLink),
    cache,
  });

  return client;
};

export default setupApollo;
