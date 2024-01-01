import React from "react";
import { Observable } from "rxjs";
import {
  IOperationsAction,
  IOperationsReducerState,
} from "./operations-tracker-container-helper";
import { CopyType, ICopyData } from "./types";
import { IDataView } from "apollo-inspector";

export interface IError {
  error: any;
  message: string;
}

export interface ILoader {
  message: string;
  loading: boolean;
}

export type stylesClasses =
  | "root"
  | "innerContainer"
  | "innerContainerDescription"
  | "name"
  | "label"
  | "centerDiv";

export interface IOperationsTrackerContainer {
  apolloClientIds: string[];
  onCopy: (copyType: CopyType, data: ICopyData) => void;
  onRecordStart: (selectedApolloClientIds: string[]) => Observable<IDataView>;
  onRecordStop: () => void;
  resetStore?: (clientId: string) => void;
  clearStore?: (clientId: string) => void;
}

export interface IUseMainSlotParams {
  operationsState: IOperationsReducerState;
  dispatchOperationsState: React.Dispatch<IOperationsAction>;
  props: IOperationsTrackerContainer;
}

export interface IUseMainSlotService {
  classes: Record<stylesClasses, string>;
}
