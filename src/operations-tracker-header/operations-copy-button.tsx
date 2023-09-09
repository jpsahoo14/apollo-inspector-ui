import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  SplitButton,
  MenuButtonProps,
  Button,
} from "@fluentui/react-components";
import * as React from "react";
import { IOperationsReducerState } from "../operations-tracker-container-helper";
import { useStyles } from "./operations-copy-button-styles";
import { IDataView } from "apollo-inspector";

const copyToClipboard = (jsonString) => {
  navigator.clipboard
    .writeText(jsonString)
    .then(() => {
      console.log("Copied to clipboard");
    })
    .catch((err) => {
      console.error("Error copying JSON:", err);
    });
};

export interface ICopyButtonProps {
  hideCopy: boolean;
  operationsState: IOperationsReducerState;
  apolloOperationsData: IDataView | null;
}

export const CopyButton = (props: ICopyButtonProps) => {
  const classes = useStyles();
  const { operationsState, hideCopy, apolloOperationsData } = props;

  const copyAll = React.useCallback(() => {
    const jsonString = JSON.stringify(apolloOperationsData?.verboseOperations); // Convert array to JSON string with indentation
    copyToClipboard(jsonString);
  }, [apolloOperationsData]);

  const copyFiltered = React.useCallback(() => {
    const jsonString = JSON.stringify(operationsState.filteredOperations); // Convert array to JSON string with indentation
    copyToClipboard(jsonString);
  }, [operationsState]);

  const copyChecked = React.useCallback(() => {
    const jsonString = JSON.stringify(operationsState.checkedOperations); // Convert array to JSON string with indentation
    copyToClipboard(jsonString);
  }, [operationsState]);

  const copySelected = React.useCallback(() => {
    const jsonString = JSON.stringify(operationsState.selectedOperation); // Convert array to JSON string with indentation
    copyToClipboard(jsonString);
  }, [operationsState]);

  const copyCache = React.useCallback(() => {
    copyToClipboard(null);
  }, [operationsState]);

  if (hideCopy) {
    return (
      <div className={classes.button}>
        <Button onClick={copyCache}>Copy Whole Apollo Cache</Button>
      </div>
    );
  }

  return (
    <div className={classes.button}>
      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          {(triggerProps: MenuButtonProps) => (
            <SplitButton
              disabled={hideCopy}
              onClick={copyAll}
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
            <MenuItem onClick={copyCache}>Copy Whole Apollo Cache</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};
