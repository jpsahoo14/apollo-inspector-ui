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
  getTheme,
  getSelectedOperationInAffectedQueriesView,
} from "./states";
import { getFilterSetStore } from "./states/get-filterset";
import { getColumnOptions } from "./states/get-column-options";

export const createTrackerStore = () => {
  return createStore<IStore>((set: ISet) => {
    return {
      ...getApolloClients(set),
      ...getApolloInspectorStopTracking(set),
      ...getApolloOperationsDataStore(set),
      ...getColumnOptions(set),
      ...getErrorStore(set),
      ...getFilterSetStore(set),
      ...getIsRecordingStore(set),
      ...getLoaderStore(set),
      ...getOpenDescriptionStore(set),
      ...getSearchBannerStore(set),
      ...getSelectedApolloClientId(set),
      ...getSelectedTabStore(set),
      ...getTheme(set),
      ...getSelectedOperationInAffectedQueriesView(set),
    };
  });
};
