import { IDataView } from "apollo-inspector";
import { produce } from "immer";
import { IStore, ISet, IApolloOperationsDataStore } from "../store.interface";

export const getApolloOperationsDataStore = (
  set: ISet
): IApolloOperationsDataStore => {
  return {
    apolloOperationsData: null,
    setApolloOperationsData: (data: IDataView | null) => {
      return set((state: IStore) => {
        return produce(state, (draft: IStore) => {
          draft.apolloOperationsData = data;
        });
      });
    },
  };
};
