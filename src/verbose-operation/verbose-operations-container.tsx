import * as React from "react";
import { IVerboseOperation } from "apollo-inspector";
import { useStyles } from "./verbose-operations-container-styles";
import { VerboseOperationView } from "./verbose-operation-view";
import { DataGridView } from "./data-grid-view";
import { ICountReducerAction } from "../operations-tracker-body/operations-tracker-body.interface";
import {
  IOperationsAction,
  IOperationsReducerState,
  OperationReducerActionEnum,
} from "../operations-tracker-container-helper";

export interface IVerboseOperationsContainerProps {
  operations: IVerboseOperation[] | null;
  operationsState: IOperationsReducerState;
  dispatchOperationsCount: React.Dispatch<ICountReducerAction>;
  dispatchOperationsState: React.Dispatch<IOperationsAction>;
}

export const VerboseOperationsContainer = (
  props: IVerboseOperationsContainerProps
) => {
  const {
    operations,
    operationsState,
    dispatchOperationsCount,
    dispatchOperationsState,
  } = props;

  const classes = useStyles();
  const verboseStyle = operationsState.selectedOperation
    ? classes.selectedOperationView
    : classes.notselectedOperationView;

  const closeVerboseOperationView = React.useCallback(() => {
    dispatchOperationsState({
      type: OperationReducerActionEnum.UpdateSelectedOperation,
      value: undefined,
    });
  }, [dispatchOperationsState]);

  return (
    <div style={classes.root}>
      <div style={classes.allOperationsView}>
        <DataGridView
          key={"OperationsDataGridView"}
          operations={operations}
          operationsState={operationsState}
          dispatchOperationsCount={dispatchOperationsCount}
          dispatchOperationsState={dispatchOperationsState}
        />
      </div>
      <div style={verboseStyle}>
        <VerboseOperationView
          key={"VerboseOperationView"}
          operation={operationsState.selectedOperation}
          closeVerboseOperationView={closeVerboseOperationView}
        />
      </div>
    </div>
  );
};
