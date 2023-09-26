import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { executorLink } from "./executor-link";
import { delayLink } from "./delay-link";

export const createClient = () => {
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    cache,
    link: ApolloLink.concat(delayLink, executorLink),
  });

  return client;
};
