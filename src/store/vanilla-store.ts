import { createStore } from "zustand";
import { IStore, ISet } from "./store.interface";
import {
  getLoaderStore,
  getIsRecordingStore,
  getApolloClients,
  getApolloOperationsDataStore,
  getSelectedApolloClientId,
  getApolloInspectorStopTracking,
  getSearchBannerStore,
  getErrorStore,
  getSelectedTabStore,
  getOpenDescriptionStore,
} from "./states";
import { getFilterSetStore } from "./states/get-filterset";
import { getColumnOptions } from "./states/get-column-options";

export const createTrackerStore = () => {
  return createStore<IStore>((set: ISet) => {
    return {
      ...getApolloOperationsDataStore(set),
      ...getLoaderStore(set),
      ...getIsRecordingStore(set),
      ...getApolloClients(set),
      ...getSelectedApolloClientId(set),
      ...getApolloInspectorStopTracking(set),
      ...getSearchBannerStore(set),
      ...getErrorStore(set),
      ...getSelectedTabStore(set),
      ...getOpenDescriptionStore(set),
      ...getFilterSetStore(set),
      ...getColumnOptions(set),
    };
  });
};
