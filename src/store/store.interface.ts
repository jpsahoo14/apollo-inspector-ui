import { IDataView } from "apollo-inspector";
import { ApolloClientsObject } from "../types";

export interface IStore
  extends IApolloOperationsDataStore,
    ILoaderStore,
    IIsRecordingStore,
    IApolloClientsStore,
    ISelectedApolloClientId,
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

export interface IIsRecordingStore {
  isRecording: boolean;
  setIsRecording: ISetState<boolean>;
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
  stopApolloInspectorTracking: () => void;
  setStopApolloInspectorTracking: ISetState<() => void>;
}

export type ISetState<T> = (value: T | ((prevState: T) => T)) => void;
