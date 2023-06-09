import { create } from "zustand";
import { IStore, ISet } from "./store.interface";
import {
  getLoaderStore,
  getIsRecordingStore,
  getApolloClients,
  getApolloOperationsDataStore,
  getSelectedApolloClientId,
  getApolloInspectorStopTracking,
} from "./states";

export const useTrackerStore = create<IStore>((set: ISet) => {
  return {
    ...getApolloOperationsDataStore(set),
    ...getLoaderStore(set),
    ...getIsRecordingStore(set),
    ...getApolloClients(set),
    ...getSelectedApolloClientId(set),
    ...getApolloInspectorStopTracking(set),
  };
});
