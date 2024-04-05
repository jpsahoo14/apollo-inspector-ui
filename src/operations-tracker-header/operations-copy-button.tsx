import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  SplitButton,
  MenuButtonProps,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  OpenPopoverEvents,
  OnOpenChangeData,
} from "@fluentui/react-components";
import * as React from "react";
import { IOperationsReducerState } from "../operations-tracker-container-helper";
import { useStyles } from "./operations-copy-button-styles";
import { TrackerStoreContext } from "../store";
import {
  CopyType,
  ICopyData,
  IGraphqlOperationValue,
  RecordingState,
} from "../types";
import { cloneDeep } from "lodash-es";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { IVerboseOperation } from "apollo-inspector";
import { getOperationName } from "../utils/apollo-operations-tracker-utils";
import { DocumentNode } from "graphql";

export interface ICopyButtonProps {
  operationsState: IOperationsReducerState;
  onCopy: (copyType: CopyType, data: ICopyData) => void;
}

export const CopyButton = (props: ICopyButtonProps) => {
  const { operationsState } = props;

  const classes = useStyles();
  const {
    copySelected,
    copyChecked,
    copyFiltered,
    copyAll,
    recordingState,
    openCopyPopover,
  } = useOperationsCopy(props);
  if (recordingState === RecordingState.Initial) {
    return null;
  }

  const copyMenuButton = getCopyMenuBtn(
    classes,
    copyAll,
    operationsState,
    copyFiltered,
    copyChecked,
    copySelected
  );

  return (
    <Popover appearance="brand" open={openCopyPopover}>
      <PopoverTrigger>{copyMenuButton}</PopoverTrigger>
      <PopoverSurface>{"Copied!"}</PopoverSurface>
    </Popover>
  );
};

const useOperationsCopy = (props: ICopyButtonProps) => {
  const { openCopyPopover, onOpenChangeCopyPopover, setCopyPopover } =
    useCoySuccessfulPopover();
  const { copySelected, copyChecked, copyFiltered, copyAll, recordingState } =
    useCopy(props, setCopyPopover);
  return {
    copySelected,
    copyChecked,
    copyFiltered,
    copyAll,
    recordingState,
    openCopyPopover,
    onOpenChangeCopyPopover,
  };
};

const useCoySuccessfulPopover = () => {
  const [open, setOpen] = React.useState(false);

  const onOpenChange = React.useCallback(
    (_e: OpenPopoverEvents, data: OnOpenChangeData) => {
      setOpen(data.open || false);
    },
    []
  );

  const setCopyPopover = React.useCallback(
    (open: boolean) => {
      setOpen(open);

      setTimeout(() => {
        setOpen(!open);
      }, 2000);
    },
    [setOpen]
  );
  return {
    openCopyPopover: open,
    onOpenChangeCopyPopover: onOpenChange,
    setCopyPopover,
  };
};
const useCopy = (
  props: ICopyButtonProps,
  setCopyPopover: (open: boolean) => void
) => {
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
      operations:
        cloneDeep(
          convertOperationsToBeCopied(apolloOperationsData?.operations)
        ) || [],
    });
    setCopyPopover(true);
  }, [apolloOperationsData, onCopy]);

  const copyFiltered = React.useCallback(() => {
    onCopy(CopyType.FilteredOperations, {
      operations:
        cloneDeep(
          convertOperationsToBeCopied(operationsState.filteredOperations)
        ) || [],
    });
    setCopyPopover(true);
  }, [operationsState, onCopy]);

  const copyChecked = React.useCallback(() => {
    onCopy(CopyType.CheckedOperations, {
      operations:
        cloneDeep(
          convertOperationsToBeCopied(operationsState.checkedOperations)
        ) || [],
    });
    setCopyPopover(true);
  }, [operationsState, onCopy]);

  const copySelected = React.useCallback(() => {
    if (operationsState.selectedOperation?.id) {
      onCopy(CopyType.CheckedOperations, {
        operations:
          cloneDeep(
            convertOperationsToBeCopied([operationsState?.selectedOperation])
          ) || [],
      });
      setCopyPopover(true);
    }
  }, [operationsState, onCopy]);

  return { copySelected, copyChecked, copyFiltered, copyAll, recordingState };
};

const convertOperationsToBeCopied = (
  operations: IVerboseOperation[] | undefined | null
): IGraphqlOperationValue[] | undefined => {
  const modified = operations?.map(
    (op: IVerboseOperation): IGraphqlOperationValue => {
      return {
        clientId: op.clientId,
        affectedQueries: op.affectedQueries.map((query) =>
          getOperationName(query as DocumentNode)
        ),
        affectedQueriesDueToOptimisticResponse:
          op.affectedQueriesDueToOptimisticResponse?.map((query) =>
            getOperationName(query as DocumentNode)
          ),
        error: op.error,
        fetchPolicy: op.fetchPolicy,
        srNo: op.id,
        operationName: op.operationName,
        operationString: op.operationString,
        operationType: op.operationType,
        result: op.result,
        status: op.status,
        timing: op.timing,
        variables: op.variables,
        warning: op.warning,
      };
    }
  );

  return modified;
};

const getCopyMenuBtn = (
  classes: Record<"button", string>,
  copyAll: () => void,
  operationsState: IOperationsReducerState,
  copyFiltered: () => void,
  copyChecked: () => void,
  copySelected: () => void
) => (
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
            <MenuItem onClick={copyFiltered}>Copy Filtered Operations</MenuItem>
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
