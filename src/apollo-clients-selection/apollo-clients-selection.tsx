import React from "react";
import { Checkbox, Button, Tooltip, Typography } from "antd";
import { CopyOutlined, ReloadOutlined, ClearOutlined } from "@ant-design/icons";
import { IErrorType, ISetState, TrackerStoreContext } from "../store";
import { useStyles } from "./apollo-clients-selection-styles";
import { CopyType, ICopyData, RecordingState } from "../types";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

const { Text } = Typography;

export interface IApolloClientSelectionProps {
  clientIds: string[];
  onCopy: (copyType: CopyType, data: ICopyData) => void;
  resetStore?: (clientId: string) => void;
  clearStore?: (clientId: string) => void;
}
export const ApolloClientSelection = (props: IApolloClientSelectionProps) => {
  const { clientIds, onCopy, clearStore, resetStore } = props;
  const classes = useStyles();
  const store = React.useContext(TrackerStoreContext);

  const {
    selectedApolloClientIds,
    setSelectedApolloClientIds,
    error,
    recordingState,
  } = useStore(
    store,
    useShallow((store) => ({
      selectedApolloClientIds: store.selectedApolloClientIds,
      setSelectedApolloClientIds: store.setSelectedApolloClientIds,
      error: store.error,
      recordingState: store.recordingState,
    }))
  );

  const checkBoxes = useApolloClientCheckboxes({
    clientIds,
    selectedApolloClientIds,
    setSelectedApolloClientIds,
    onCopy,
    recordingState,
    classes,
    clearStore,
    resetStore,
  });

  return (
    <div style={classes.root}>
      <Text strong style={classes.label}>
        Select the Apollo Clients to track operations
      </Text>
      {error.error && error.type === IErrorType.Normal ? (
        <Text strong type="danger" style={classes.errorLabel}>
          {error.message}
        </Text>
      ) : null}
      <div style={classes.checkBoxes}>{checkBoxes}</div>
    </div>
  );
};

interface IUseApolloClientCheckboxes {
  clientIds: string[];
  resetStore?: (clientId: string) => void;
  clearStore?: (clientId: string) => void;
  selectedApolloClientIds: string[];
  setSelectedApolloClientIds: ISetState<string[]>;
  onCopy: (copyType: CopyType, data: ICopyData) => void;
  recordingState: RecordingState;
  classes: Record<
    | "root"
    | "label"
    | "checkBoxes"
    | "errorLabel"
    | "copyButton"
    | "checkboxWrapper",
    string
  >;
}
const useApolloClientCheckboxes = ({
  classes,
  clientIds,
  onCopy,
  recordingState,
  selectedApolloClientIds,
  setSelectedApolloClientIds,
  clearStore,
  resetStore,
}: IUseApolloClientCheckboxes) =>
  React.useMemo(() => {
    return clientIds.map((clientId) => {
      const checked = selectedApolloClientIds.find(
        (selected) => selected === clientId
      );
      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
          const selectedClientIdsCopy = selectedApolloClientIds.concat([]);
          selectedClientIdsCopy.push(clientId);
          setSelectedApolloClientIds(selectedClientIdsCopy);
        } else {
          const selectedClientIdsCopy = selectedApolloClientIds.concat([]);
          const updatedList = selectedClientIdsCopy.filter(
            (selectedClientId) => selectedClientId !== clientId
          );
          setSelectedApolloClientIds(updatedList);
        }
      };

      const onCopyCache = () => {
        onCopy(CopyType.WholeApolloCache, { clientId });
      };
      const onClearStore = () => {
        clearStore?.(clientId);
      };

      const onResetStore = () => {
        resetStore?.(clientId);
      };
      const shouldDisable = recordingState === RecordingState.RecordingStarted;
      return (
        <div style={classes.checkboxWrapper} key={clientId}>
          <Checkbox
            checked={!!checked}
            onChange={onChange}
            key={clientId}
            disabled={!!shouldDisable}
          >
            {clientId}
          </Checkbox>
          <Tooltip title="Copy whole apollo cache">
            <Button
              style={classes.copyButton}
              size="small"
              icon={<CopyOutlined />}
              onClick={onCopyCache}
            />
          </Tooltip>
          {clearStore && (
            <Tooltip title="Clear apollo client store.">
              <Button
                style={classes.copyButton}
                size="small"
                icon={<ClearOutlined />}
                onClick={onClearStore}
              />
            </Tooltip>
          )}
          {resetStore && (
            <Tooltip title="Reset apollo client store">
              <Button
                style={classes.copyButton}
                size="small"
                icon={<ReloadOutlined />}
                onClick={onResetStore}
              />
            </Tooltip>
          )}
        </div>
      );
    });
  }, [
    clientIds,
    classes,
    recordingState,
    selectedApolloClientIds,
    onCopy,
    setSelectedApolloClientIds,
    clearStore,
    resetStore,
  ]);
