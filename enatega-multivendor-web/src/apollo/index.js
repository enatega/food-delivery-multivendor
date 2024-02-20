import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  InMemoryCache,
  Observable,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import ConfigurableValues from "../config/constants";

const setupApollo = () => {
  const { SERVER_URL, WS_SERVER_URL } = ConfigurableValues();
  const cache = new InMemoryCache();
  const httpLink = createHttpLink({
    uri: `${SERVER_URL}graphql`,
  });

  const wsLink = new WebSocketLink({
    uri: `${WS_SERVER_URL}graphql`,
    options: {
      reconnect: true,
    },
  });

  const request = async (operation) => {
    const data = localStorage.getItem("token");

    let token = null;
    if (data) {
      token = data;
    }
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  };

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle;
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

  const terminatingLink = split(({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  }, wsLink);

  const client = new ApolloClient({
    link: concat(ApolloLink.from([terminatingLink, requestLink]), httpLink),
    cache,
    resolvers: {},
    connectToDevTools: true,
  });

  return client;
};

export default setupApollo;
