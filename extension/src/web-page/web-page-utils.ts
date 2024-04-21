import { IApolloClientObject } from "apollo-inspector";
import { Default_Apollo_Client_Name } from "../utils";

export const getApolloClientsObj = (): IApolloClientObject[] => {
  if (window.__APOLLO_CLIENTS__ && window.__APOLLO_CLIENTS__.length) {
    return window.__APOLLO_CLIENTS__;
  }

  if (window.__APOLLO_CLIENT__) {
    const values: IApolloClientObject[] = [
      {
        clientId: Default_Apollo_Client_Name,
        client: window.__APOLLO_CLIENT__ as any,
      },
    ];

    return values;
  }

  return [];
};
