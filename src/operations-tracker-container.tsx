import React from "react";
import { mergeClasses, Spinner, Title2 } from "@fluentui/react-components";
import { OperationsTrackerBody } from "./operations-tracker-body/operations-tracker-body";
import { useStyles } from "./operations-tracker-container-styles";
import { OperationsTrackerHeader } from "./operations-tracker-header/operations-tracker-header";
import {
  IOperationsTrackerContainer,
  IUseMainSlotParams,
  IUseMainSlotService,
} from "./operations-tracker-container.interface";
import { ErrorBoundary } from "./operation-tracker-error-boundary";
import {
  getInitialState,
  OperationReducerActionEnum,
  reducers,
} from "./operations-tracker-container-helper";
import { IErrorType, useTrackerStore } from "./store";
import { RecordingState } from "./types";
import { ApolloClientSelection } from "./apollo-clients-selection/apollo-clients-selection";

export const OperationsTrackerContainer = (
  props: IOperationsTrackerContainer
) => {
  const classes = useStyles();
  const { onCopy, onRecordStart, onRecordStop } = props;
  const {
    openDescription,
    operationsState,
    dispatchOperationsState,
    setSearchText,
  } = useOperationsTrackerContainer(props);

  const mainSlot = useMainSlot(
    {
      operationsState,
      dispatchOperationsState,
      props,
    },
    { classes }
  );

  return (
    <ErrorBoundary>
      <div className={classes.root}>
        <div
          className={mergeClasses(
            classes.innerContainer,
            openDescription && classes.innerContainerDescription
          )}
        >
          <OperationsTrackerHeader
            setSearchText={setSearchText}
            operationsState={operationsState}
            onRecordStart={onRecordStart}
            onRecordStop={onRecordStop}
            onCopy={onCopy}
          />
          {mainSlot}
        </div>
      </div>
    </ErrorBoundary>
  );
};

const useSetSelectedApolloClient = (props: IOperationsTrackerContainer) => {
  const [
    setApolloClients,
    selectedApolloClientIds,
    setSelectedApolloClientIds,
  ] = useTrackerStore((store) => [
    store.setApolloClients,
    store.selectedApolloClientIds,
    store.setSelectedApolloClientIds,
  ]);

  React.useEffect(() => {
    const currentApolloClients = props.apolloClientIds;
    setApolloClients(currentApolloClients);
  }, [props.apolloClientIds, setApolloClients]);

  React.useEffect(() => {
    const currentApolloClientsIds = props.apolloClientIds;
    if (selectedApolloClientIds.length !== 0) {
      const finalSelectedApolloClientsIds: string[] = [];
      selectedApolloClientIds.forEach((apolloClientId) => {
        const result = currentApolloClientsIds.find(
          (cliendId) => cliendId === apolloClientId
        );
        if (result) {
          finalSelectedApolloClientsIds.push(apolloClientId);
        }
      });
      if (
        finalSelectedApolloClientsIds.length !== selectedApolloClientIds.length
      ) {
        setSelectedApolloClientIds(finalSelectedApolloClientsIds);
      }
    }
  }, [
    props.apolloClientIds,
    setApolloClients,
    selectedApolloClientIds,
    setSelectedApolloClientIds,
  ]);
};

const useMainSlot = (
  { dispatchOperationsState, operationsState, props }: IUseMainSlotParams,
  { classes }: IUseMainSlotService
) => {
  const { onCopy, apolloClientIds } = props;
  const { apollOperationsData, error, loader, recordingState } =
    useTrackerStore((store) => ({
      apollOperationsData: store.apolloOperationsData,
      error: store.error,
      loader: store.loader,
      recordingState: store.recordingState,
      selectedApolloClientIds: store.selectedApolloClientIds,
    }));

  if (
    recordingState == RecordingState.Initial ||
    (!apollOperationsData && recordingState === RecordingState.RecordingStopped)
  ) {
    return (
      <ApolloClientSelection clientIds={apolloClientIds} onCopy={onCopy} />
    );
  }
  if (error.error && error.type === IErrorType.FullPage) {
    return (
      <div className={classes.centerDiv}>
        <Title2>{error.message}</Title2>
      </div>
    );
  }
  if (loader.loading) {
    return (
      <div className={classes.centerDiv}>
        <Spinner labelPosition="below" label={loader.message} />
      </div>
    );
  }
  return (
    <OperationsTrackerBody
      dispatchOperationsState={dispatchOperationsState}
      data={apollOperationsData}
      operationsState={operationsState}
      apolloClientIds={apolloClientIds}
      onCopy={onCopy}
    />
  );
};

const useOperationsTrackerContainer = (props: IOperationsTrackerContainer) => {
  const { openDescription } = useTrackerStore((store) => ({
    openDescription: store.openDescription,
  }));

  const [operationsState, dispatchOperationsState] = React.useReducer(
    reducers,
    getInitialState()
  );

  useSetSelectedApolloClient(props);

  const setSearchText = React.useCallback(
    (text: string) => {
      dispatchOperationsState({
        type: OperationReducerActionEnum.UpdateSearchText,
        value: text,
      });
    },
    [dispatchOperationsState]
  );

  return {
    openDescription,
    operationsState,
    dispatchOperationsState,
    setSearchText,
  };
};
