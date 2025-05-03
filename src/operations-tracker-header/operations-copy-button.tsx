import * as React from "react";
import { Button, Dropdown, message, Space } from "antd";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
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
  } = useOperationsCopy(props);
  
  if (recordingState === RecordingState.Initial) {
    return null;
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'all',
      label: 'Copy All Operations',
      onClick: () => copyAll(),
    }
  ];
  
  if ((operationsState.filteredOperations?.length || 0) > 0) {
    menuItems.push({
      key: 'filtered',
      label: 'Copy Filtered Operations',
      onClick: () => copyFiltered()
    });
  }
  
  if ((operationsState.checkedOperations?.length || 0) > 0) {
    menuItems.push({
      key: 'checked',
      label: 'Copy Checked Operations',
      onClick: () => copyChecked()
    });
  }
  
  if (operationsState.selectedOperation) {
    menuItems.push({
      key: 'selected',
      label: 'Copy currently Opened Operation',
      onClick: () => copySelected()
    });
  }

  return (
    <div style={classes.button}>
      <Dropdown menu={{ items: menuItems }}>
        <Button onClick={copyAll}>
          <Space>
            Copy All
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
};

const useOperationsCopy = (props: ICopyButtonProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { copySelected, copyChecked, copyFiltered, copyAll, recordingState } =
    useCopy(props, () => messageApi.success('Copied!'));
  return {
    copySelected,
    copyChecked,
    copyFiltered,
    copyAll,
    recordingState,
  };
};

const useCopy = (
  props: ICopyButtonProps,
  showCopyMessage: () => void
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
    showCopyMessage();
  }, [apolloOperationsData, onCopy, showCopyMessage]);

  const copyFiltered = React.useCallback(() => {
    onCopy(CopyType.FilteredOperations, {
      operations:
        cloneDeep(
          convertOperationsToBeCopied(operationsState.filteredOperations)
        ) || [],
    });
    showCopyMessage();
  }, [operationsState, onCopy, showCopyMessage]);

  const copyChecked = React.useCallback(() => {
    onCopy(CopyType.CheckedOperations, {
      operations:
        cloneDeep(
          convertOperationsToBeCopied(operationsState.checkedOperations)
        ) || [],
    });
    showCopyMessage();
  }, [operationsState, onCopy, showCopyMessage]);

  const copySelected = React.useCallback(() => {
    if (operationsState.selectedOperation?.id) {
      onCopy(CopyType.CheckedOperations, {
        operations:
          cloneDeep(
            convertOperationsToBeCopied([operationsState?.selectedOperation])
          ) || [],
      });
      showCopyMessage();
    }
  }, [operationsState, onCopy, showCopyMessage]);

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
        duration: op.duration,
        variables: op.variables,
        warning: op.warning,
      };
    }
  );

  return modified;
};
