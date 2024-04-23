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
  reducers,
} from "./operations-tracker-container-helper";
import {
  IErrorType,
  TrackerStoreProvider,
  createTrackerStore,
  TrackerStoreContext,
  ISetState,
} from "./store";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { RecordingState } from "./types";
import { ApolloClientSelection } from "./apollo-clients-selection/apollo-clients-selection";

export const OperationsTrackerContainer = (
  props: IOperationsTrackerContainer
) => {
  const trackerStore = React.useMemo(() => createTrackerStore(), []);
  const trackerStoreRef = React.useRef(trackerStore);
  return (
    <TrackerStoreProvider value={trackerStoreRef.current}>
      <OperationsTrackerContainerInner {...props} />
    </TrackerStoreProvider>
  );
};

export const OperationsTrackerContainerInner = (
  props: IOperationsTrackerContainer
) => {
  const classes = useStyles();
  const { onCopy, onRecordStart, onRecordStop, shouldStartRecordingOnMount } =
    props;
  const { openDescription, operationsState, dispatchOperationsState } =
    useOperationsTrackerContainer(props);

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
            operationsState={operationsState}
            onRecordStart={onRecordStart}
            onRecordStop={onRecordStop}
            onCopy={onCopy}
            shouldStartRecordingOnMount={shouldStartRecordingOnMount}
          />
          {mainSlot}
        </div>
      </div>
    </ErrorBoundary>
  );
};

const useSetSelectedApolloClient = (props: IOperationsTrackerContainer) => {
  const store = React.useContext(TrackerStoreContext);
  const [
    setApolloClients,
    selectedApolloClientIds,
    setSelectedApolloClientIds,
  ] = useStore(
    store,
    useShallow((store) => [
      store.setApolloClients,
      store.selectedApolloClientIds,
      store.setSelectedApolloClientIds,
    ])
  );

  React.useEffect(() => {
    const currentApolloClients = props.apolloClientIds;
    setApolloClients(currentApolloClients);
  }, [props.apolloClientIds, setApolloClients]);

  useResetSelectedApolloClientIdsWithCurrentApolloClientIds({
    props,
    selectedApolloClientIds,
    setSelectedApolloClientIds,
    setApolloClients,
  });
};

const useMainSlot = (
  { dispatchOperationsState, operationsState, props }: IUseMainSlotParams,
  { classes }: IUseMainSlotService
) => {
  const { onCopy, apolloClientIds, clearStore, resetStore } = props;
  const store = React.useContext(TrackerStoreContext);

  const { apollOperationsData, error, loader, recordingState } = useStore(
    store,
    useShallow((store) => ({
      apollOperationsData: store.apolloOperationsData,
      error: store.error,
      loader: store.loader,
      recordingState: store.recordingState,
      selectedApolloClientIds: store.selectedApolloClientIds,
    }))
  );

  if (
    recordingState == RecordingState.Initial ||
    (!apollOperationsData && recordingState === RecordingState.RecordingStopped)
  ) {
    return (
      <ApolloClientSelection
        clientIds={apolloClientIds}
        onCopy={onCopy}
        clearStore={clearStore}
        resetStore={resetStore}
      />
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
      clearStore={clearStore}
      resetStore={resetStore}
    />
  );
};

const useOperationsTrackerContainer = (props: IOperationsTrackerContainer) => {
  const store = React.useContext(TrackerStoreContext);
  const { openDescription } = useStore(
    store,
    useShallow((store) => ({
      openDescription: store.openDescription,
    }))
  );

  const [operationsState, dispatchOperationsState] = React.useReducer(
    reducers,
    getInitialState()
  );

  useSetSelectedApolloClient(props);

  return {
    openDescription,
    operationsState,
    dispatchOperationsState,
  };
};

interface IUseResetSelectedApolloClientIdsWithCurrentApolloClientIds {
  props: IOperationsTrackerContainer;
  selectedApolloClientIds: string[];
  setSelectedApolloClientIds: ISetState<string[]>;
  setApolloClients: ISetState<string[]>;
}
const useResetSelectedApolloClientIdsWithCurrentApolloClientIds = ({
  props,
  selectedApolloClientIds,
  setApolloClients,
  setSelectedApolloClientIds,
}: IUseResetSelectedApolloClientIdsWithCurrentApolloClientIds) => {
  React.useEffect(() => {
    const currentApolloClientsIds = props.apolloClientIds;
    if (selectedApolloClientIds.length !== 0) {
      const finalSelectedApolloClientsIds: string[] = [];
      selectedApolloClientIds.forEach((selectedApolloClientId) => {
        const found = currentApolloClientsIds.find(
          (cliendId) => cliendId === selectedApolloClientId
        );
        if (found) {
          finalSelectedApolloClientsIds.push(selectedApolloClientId);
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
