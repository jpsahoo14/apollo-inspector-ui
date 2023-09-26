import { IDataView } from "apollo-inspector";
import {
  IOperationsAction,
  IOperationsReducerState,
} from "./operations-tracker-container-helper";

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

export interface IUseMainSlotParams {
  operationsState: IOperationsReducerState;
  dispatchOperationsState: React.Dispatch<IOperationsAction>;
}

export interface IUseMainSlotService {
  classes: Record<stylesClasses, string>;
}
