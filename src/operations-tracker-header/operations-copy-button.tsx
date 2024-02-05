import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  SplitButton,
  MenuButtonProps,
} from "@fluentui/react-components";
import * as React from "react";
import { IOperationsReducerState } from "../operations-tracker-container-helper";
import { useStyles } from "./operations-copy-button-styles";
import { TrackerStoreContext } from "../store";
import { CopyType, ICopyData, RecordingState } from "../types";
import { cloneDeep } from "lodash-es";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

export interface ICopyButtonProps {
  operationsState: IOperationsReducerState;
  onCopy: (copyType: CopyType, data: ICopyData) => void;
}

export const CopyButton = (props: ICopyButtonProps) => {
  const classes = useStyles();
  const { operationsState, onCopy } = props;
  const store = React.useContext(TrackerStoreContext);
  const { apolloOperationsData, recordingState } = useStore(
    store,
    useShallow((store) => ({
      apolloOperationsData: store.apolloOperationsData,
      recordingState: store.recordingState,
    }))
  );

  const copyAll = React.useCallback(() => {
    onCopy(CopyType.AllOperations, {
      operations: cloneDeep(apolloOperationsData?.operations) || [],
    });
  }, [apolloOperationsData, onCopy]);

  const copyFiltered = React.useCallback(() => {
    onCopy(CopyType.FilteredOperations, {
      operations: cloneDeep(operationsState.filteredOperations) || [],
    });
  }, [operationsState, onCopy]);

  const copyChecked = React.useCallback(() => {
    onCopy(CopyType.CheckedOperations, {
      operations: cloneDeep(operationsState.checkedOperations) || [],
    });
  }, [operationsState, onCopy]);

  const copySelected = React.useCallback(() => {
    if (operationsState.selectedOperation?.id) {
      onCopy(CopyType.CheckedOperations, {
        operations: cloneDeep([operationsState?.selectedOperation]) || [],
      });
    }
  }, [operationsState, onCopy]);

  if (recordingState === RecordingState.Initial) {
    return null;
  }

  return (
    <div className={classes.button}>
      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          {(triggerProps: MenuButtonProps) => (
            <SplitButton
              primaryActionButton={{ onClick: copyAll }}
              menuButton={triggerProps}
            >
              Copy All
            </SplitButton>
          )}
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem onClick={copyAll}>Copy All Operations</MenuItem>
            {(operationsState.filteredOperations?.length || 0) > 0 ? (
              <MenuItem onClick={copyFiltered}>
                Copy Filtered Operations
              </MenuItem>
            ) : null}
            {(operationsState.checkedOperations?.length || 0) > 0 ? (
              <MenuItem onClick={copyChecked}>Copy Checked Operations</MenuItem>
            ) : null}
            {operationsState.selectedOperation ? (
              <MenuItem onClick={copySelected}>
                Copy currently Opened Operation
              </MenuItem>
            ) : null}
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};
