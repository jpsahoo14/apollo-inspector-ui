import {
  ISet,
  ILoaderStore,
  ILoader,
  IStore,
  IApolloClientsStore,
} from "./store.interface";
import { createState } from "./create-state";

export const getApolloClients = (set: ISet): IApolloClientsStore => {
  const [apolloClients, setApolloClients] = createState(
    {},
    "apolloClients",
    set
  );

  return { apolloClients, setApolloClients };
};
