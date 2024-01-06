import create from 'zustand';
import { IStore, ISet } from './store.interface';
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
} from './states';
import { getFilterSetStore } from './states/get-filterset';
import { getColumnOptions } from './states/get-column-options';

export const useTrackerStore = create<IStore>((set: ISet) => {
  // Functions to reset each individual store
  const resetStores = () => {
    getApolloOperationsDataStore(set).reset();
    getLoaderStore(set).reset();
    getIsRecordingStore(set).reset();
    getApolloClients(set).reset();
    getSelectedApolloClientId(set).reset();
    getApolloInspectorStopTracking(set).reset();
    getSearchBannerStore(set).reset();
    getErrorStore(set).reset();
    getSelectedTabStore(set).reset();
    getOpenDescriptionStore(set).reset();
    getFilterSetStore(set).reset();
    getColumnOptions(set).reset();
    // Add more reset functions for other stores as needed
  };

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

    // Function to clear all stores
    clearStore: () => {
      resetStores();
      // Optionally perform any additional cleanup or reset logic here
    },
  };
});
