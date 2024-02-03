import React from "react";
import {
  Checkbox,
  Label,
  CheckboxOnChangeData,
  Button,
  Tooltip,
  Text,
} from "@fluentui/react-components";
import { IErrorType, ISetState, TrackerStoreContext } from "../store";
import { useStyles } from "./apollo-clients-selection-styles";
import {
  DocumentCopyRegular,
  ArrowResetRegular,
  BroomRegular,
} from "@fluentui/react-icons";
import { CopyType, ICopyData, RecordingState } from "../types";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

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
    <div className={classes.root}>
      <Label size="large" weight="semibold" className={classes.label}>
        Select the Apollo Clients to track operations
      </Label>
      {error.error && error.type === IErrorType.Normal ? (
        <Label size="large" weight="semibold" className={classes.errorLabel}>
          {error.message}
        </Label>
      ) : null}
      <div className={classes.checkBoxes}>{checkBoxes}</div>
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
      const onChange = (
        e: React.SyntheticEvent,
        props: CheckboxOnChangeData
      ) => {
        if (props.checked) {
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
        <div className={classes.checkboxWrapper} key={clientId}>
          <Checkbox
            checked={!!checked}
            label={clientId}
            onChange={onChange}
            key={clientId}
            disabled={!!shouldDisable}
          />
          <Tooltip
            content={<Text>Copy whole apollo cache</Text>}
            relationship="label"
          >
            <Button
              className={classes.copyButton}
              size="small"
              icon={<DocumentCopyRegular />}
              onClick={onCopyCache}
            />
          </Tooltip>
          {clearStore && (
            <Tooltip
              content={<Text>Clear apollo client store.</Text>}
              relationship="label"
            >
              <Button
                className={classes.copyButton}
                size="small"
                icon={<BroomRegular />}
                onClick={onClearStore}
              />
            </Tooltip>
          )}
          {resetStore && (
            <Tooltip
              content={<Text>Reset apollo client store</Text>}
              relationship="label"
            >
              <Button
                className={classes.copyButton}
                size="small"
                icon={<ArrowResetRegular />}
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
