import { IApolloClientObject, IDataView } from "apollo-inspector";
import { ApolloClientsObject, TabHeaders, RecordingState } from "../types";

export interface IStore
  extends IApolloOperationsDataStore,
    ILoaderStore,
    IRecordingStateStore,
    IApolloClientsStore,
    ISelectedApolloClientId,
    ISearchBannerStore,
    IErrorStore,
    ISelectedTabStore,
    IOpenDescriptionStore,
    IFilterSetStore,
    IColumnOptions,
    IStopApolloInspectorTracking {}

export type ISet = (
  partial:
    | IStore
    | Partial<IStore>
    | ((state: IStore) => IStore | Partial<IStore>),
  replace?: boolean | undefined
) => void;

export interface IApolloOperationsDataStore {
  apolloOperationsData: IDataView | null;
  setApolloOperationsData: ISetState<IDataView | null>;
}

export interface ILoaderStore {
  loader: ILoader;
  setLoader: ISetState<ILoader>;
}

export interface IColumnOptions {
  selectedColumnOptions: string[];
  setSelectedColumnOptions: ISetState<string[]>;
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

export interface IRecordingStateStore {
  recordingState: RecordingState;
  setRecordingState: ISetState<RecordingState>;
}

export interface IError {
  error: Error | null;
  message: string;
  type: IErrorType;
}

export enum IErrorType {
  FullPage,
  Normal,
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
  apolloClients: string[];
  setApolloClients: ISetState<string[]>;
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
