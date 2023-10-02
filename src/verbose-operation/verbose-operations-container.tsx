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
import { Label } from "@fluentui/react-components";
import { debounce } from "lodash-es";

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
  const [filterLabelMsg, setFilterLabelMsg] =
    React.useState<React.ReactElement | null>(null);
  const setFilterRef = React.useRef(
    debounce((operations, filteredOperations, filterLabelMsg) => {
      console.log(`jps filter`, {
        opLength: operations?.length,
        filtLength: filteredOperations?.length,
      });
      if (operations?.length !== filteredOperations?.length) {
        if (!filterLabelMsg) {
          setFilterLabelMsg(
            <Label
              size="large"
              weight="semibold"
              className={classes.filterLabelMsg}
            >{`You're viewing filtered operations`}</Label>
          );
        }

        return;
      }
      setFilterLabelMsg(null);
    }, 500)
  );

  React.useEffect(() => {
    setFilterRef.current(
      operations,
      operationsState.filteredOperations,
      filterLabelMsg
    );
  }, [operations, operationsState.filteredOperations, filterLabelMsg]);
  return (
    <div className={classes.root}>
      {filterLabelMsg}
      <div className={classes.operations}>
        <DataGridView
          key={"OperationsDataGridView"}
          operations={operations}
          operationsState={operationsState}
          dispatchOperationsCount={dispatchOperationsCount}
          dispatchOperationsState={dispatchOperationsState}
        />

        <VerboseOperationView
          key={"VerboseOperationView"}
          operation={operationsState.selectedOperation}
          dispatchOperationsState={dispatchOperationsState}
        />
      </div>
    </div>
  );
};
