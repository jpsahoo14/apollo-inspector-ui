import { IApolloClientObject } from "apollo-inspector";

export const getApolloClientsObj = (): IApolloClientObject[] => {
  if (window.__APOLLO_CLIENTS__) {
    const result = window.__APOLLO_CLIENTS__.map((ac) => {
      return { client: ac.client, clientId: ac.clientId };
    });
    return result;
  }

  return [{ client: window.__APOLLO_CLIENT__, clientId: "default" }];
};
