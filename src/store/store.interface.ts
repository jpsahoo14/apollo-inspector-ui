import { IApolloClientObject, IDataView } from "apollo-inspector";
import { ApolloClientsObject, TabHeaders } from "../types";

export interface IStore
  extends IApolloOperationsDataStore,
    ILoaderStore,
    IIsRecordingStore,
    IApolloClientsStore,
    ISelectedApolloClientId,
    ISearchBannerStore,
    IErrorStore,
    ISelectedTabStore,
    IOpenDescriptionStore,
    IFilterSetStore,
    IStopApolloInspectorTracking {}

export type ISet = (
  partial:
    | IStore
    | Partial<IStore>
    | ((state: IStore) => IStore | Partial<IStore>),
  replace?: boolean | undefined
) => void;

export interface IApolloOperationsDataStore {
  apollOperationsData: IDataView | null;
  setApolloOperationsData: ISetState<IDataView | null>;
}

export interface ILoaderStore {
  loader: ILoader;
  setLoader: ISetState<ILoader>;
}

export interface ILoader {
  message: string;
  loading: boolean;
}

export interface ISearchBannerStore {
  searchBanner: ISearchBanner;
  setSearchBanner: ISetState<ISearchBanner>;
}

export interface ISearchBanner {
  searchText: string;
  showSearchBanner: boolean;
}

export interface IIsRecordingStore {
  isRecording: boolean;
  setIsRecording: ISetState<boolean>;
}

export interface IError {
  error: any;
  message: string;
}

export interface IErrorStore {
  error: IError;
  setError: ISetState<IError>;
}

export interface ISelectedTabStore {
  selectedTab: TabHeaders;
  setSelectedTab: ISetState<TabHeaders>;
}

export interface IOpenDescriptionStore {
  openDescription: boolean;
  setOpenDescription: ISetState<boolean>;
}

export interface IApolloClientsStore {
  apolloClients: IApolloClientObject[];
  setApolloClients: ISetState<IApolloClientObject[]>;
}

export interface ISelectedApolloClientId {
  selectedApolloClientIds: string[];
  setSelectedApolloClientIds: ISetState<string[]>;
}

export interface IStopApolloInspectorTracking {
  stopApolloInspectorTracking: () => void;
  setStopApolloInspectorTracking: ISetState<() => void>;
}

export interface IFilterSet {
  results: string[];
  types: string[];
  statuses: string[];
}

export interface IFilterSetStore {
  filterSet: IFilterSet;
  setFilterSet: ISetState<IFilterSet>;
}

export type ISetState<T> = (value: T | ((prevState: T) => T)) => void;
