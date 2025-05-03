import { IVerboseOperation } from "apollo-inspector";

export interface IOperationsReducerState {
  searchText: string;
  checkedOperations: IVerboseOperation[] | null;
  filteredOperations: IVerboseOperation[] | null;
  selectedOperation: IVerboseOperation | null | undefined;
  operationTypeFilter: string | null; // Added operation type filter
}

export interface IOperationsAction {
  type: OperationReducerActionEnum;
  value: any;
}

export enum OperationReducerActionEnum {
  UpdateSearchText,
  UpdateCheckedOperations,
  UpdateFilteredOperations,
  UpdateSelectedOperation,
  UpdateOperationTypeFilter, // Added new action type
}

export const reducers = (
  state: IOperationsReducerState,
  action: IOperationsAction
): IOperationsReducerState => {
  switch (action.type) {
    case OperationReducerActionEnum.UpdateSearchText: {
      return { ...state, searchText: action.value };
    }

    case OperationReducerActionEnum.UpdateCheckedOperations: {
      return { ...state, checkedOperations: action.value };
    }

    case OperationReducerActionEnum.UpdateFilteredOperations: {
      return { ...state, filteredOperations: action.value };
    }

    case OperationReducerActionEnum.UpdateSelectedOperation: {
      return { ...state, selectedOperation: action.value };
    }

    case OperationReducerActionEnum.UpdateOperationTypeFilter: {
      return { ...state, operationTypeFilter: action.value };
    }

    default: {
      return state;
    }
  }
};

export const getInitialState = (): IOperationsReducerState => {
  return {
    checkedOperations: null,
    filteredOperations: null,
    searchText: "",
    selectedOperation: null,
    operationTypeFilter: null, // Initialize with no filter
  };
};
