import * as React from "react";
import { IVerboseOperation } from "apollo-inspector";
import { useStyles } from "./verbose-operations-container-styles";
import { VerboseOperationView } from "./verbose-operation-view";
import { DataGridView } from "./data-grid-view";
import { ICountReducerAction } from "../operations-tracker-body/operations-tracker-body.interface";
import {
  IOperationsAction,
  IOperationsReducerState,
} from "../operations-tracker-container-helper";
import { CopyType, ICopyData } from "../types";

export interface IVerboseOperationsContainerProps {
  operations: IVerboseOperation[] | null;
  operationsState: IOperationsReducerState;
  onCopy: (copyType: CopyType, data: ICopyData) => void;
  dispatchOperationsCount: React.Dispatch<ICountReducerAction>;
  dispatchOperationsState: React.Dispatch<IOperationsAction>;
}

export const VerboseOperationsContainer = (
  props: IVerboseOperationsContainerProps
) => {
  const {
    operations,
    operationsState,
    onCopy,
    dispatchOperationsCount,
    dispatchOperationsState,
  } = props;

  const classes = useStyles();
  const verboseClassName = operationsState.selectedOperation
    ? classes.selectedOperationView
    : classes.notselectedOperationView;
  return (
    <div className={classes.root}>
      <div className={classes.allOperationsView}>
        <DataGridView
          key={"OperationsDataGridView"}
          operations={operations}
          operationsState={operationsState}
          onCopy={onCopy}
          dispatchOperationsCount={dispatchOperationsCount}
          dispatchOperationsState={dispatchOperationsState}
        />
      </div>
      <div className={verboseClassName}>
        <VerboseOperationView
          key={"VerboseOperationView"}
          operation={operationsState.selectedOperation}
          dispatchOperationsState={dispatchOperationsState}
        />
      </div>
    </div>
  );
};
