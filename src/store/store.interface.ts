import { IDataView } from "apollo-inspector";
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
  apolloClients: ApolloClientsObject;
  setApolloClients: ISetState<ApolloClientsObject>;
}

export interface ISelectedApolloClientId {
  selectedApolloClientId: string;
  setSelectedApolloClientId: ISetState<string>;
}

export interface IStopApolloInspectorTracking {
  stopApolloInspectorTracking: () => IDataView;
  setStopApolloInspectorTracking: ISetState<() => IDataView>;
}

export type ISetState<T> = (value: T | ((prevState: T) => T)) => void;
