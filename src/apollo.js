import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { getMainDefinition } from "apollo-utilities";

if (! localStorage.getItem('X-HASURA-ADMIN-SECRET')) {
  console.warn('Care: no X-HASURA-ADMIN-SECRET set (in localStorage)');
};

const headers = {
  'content-type': 'application/json',
  'X-HASURA-ADMIN-SECRET': localStorage.getItem('X-HASURA-ADMIN-SECRET')
};
const getHeaders = () => {
  return headers;
};

const cache = new InMemoryCache();

const wsLink = new WebSocketLink({
  uri: "wss://demo-hasura-graphql.herokuapp.com/v1/graphql",
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: {
      headers: getHeaders()
    }
  }
});

const httpLink = new HttpLink({
  uri: "https://demo-hasura-graphql.herokuapp.com/v1/graphql",
  headers: getHeaders()
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link,
  cache
});
