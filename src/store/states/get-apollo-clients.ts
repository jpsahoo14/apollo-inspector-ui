import {
  ISet,
  IApolloClientsStore,
} from "../store.interface";
import { createState } from "../create-state";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { ApolloClientsObject } from "../../types";

export const getApolloClients = (set: ISet): IApolloClientsStore => {
  // TODO - remove this code and show Apollo client list.
  const temp1 : ApolloClient<NormalizedCacheObject> = {};
  const temp : ApolloClientsObject = {["core"]: temp1, ["abc"]: temp1};
  const [apolloClients, setApolloClients] = createState(
    temp,
    "apolloClients",
    set
  );

  return { apolloClients, setApolloClients };
};
