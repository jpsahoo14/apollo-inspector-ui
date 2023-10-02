import React from "react";
import {
  Checkbox,
  Label,
  CheckboxOnChangeData,
  Button,
  Tooltip,
} from "@fluentui/react-components";
import { IErrorType, useTrackerStore } from "../store";
import { useStyles } from "./apollo-clients-selection-styles";
import { DocumentCopyRegular } from "@fluentui/react-icons";
import { CopyType, ICopyData, RecordingState } from "../types";

export interface IApolloClientSelectionProps {
  clientIds: string[];
  onCopy: (copyType: CopyType, data: ICopyData) => void;
}
export const ApolloClientSelection = (props: IApolloClientSelectionProps) => {
  const { clientIds, onCopy } = props;
  const classes = useStyles();
  const {
    selectedApolloClientIds,
    setSelectedApolloClientIds,
    error,
    recordingState,
  } = useTrackerStore((store) => ({
    selectedApolloClientIds: store.selectedApolloClientIds,
    setSelectedApolloClientIds: store.setSelectedApolloClientIds,
    error: store.error,
    recordingState: store.recordingState,
  }));

  const checkBoxes = React.useMemo(() => {
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
          <Tooltip content="Copy whole apollo cache" relationship="label">
            <Button
              className={classes.copyButton}
              size="small"
              icon={<DocumentCopyRegular />}
              onClick={onCopyCache}
            />
          </Tooltip>
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
  ]);

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
