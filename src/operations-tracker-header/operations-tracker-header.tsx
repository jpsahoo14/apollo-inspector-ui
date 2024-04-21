import React, { useCallback } from "react";
import { Button } from "@fluentui/react-components";
import { Info20Regular } from "@fluentui/react-icons";
import { useStyles } from "./operations-tracker-header-styles";
import { Search } from "../search/search";
import { debounce } from "lodash-es";
import { CopyButton } from "./operations-copy-button";
import { IOperationsReducerState } from "../operations-tracker-container-helper";
import {
  TrackerStoreContext,
  ISetState,
  IErrorType,
  IError,
  ILoader,
} from "../store";
import { Observable } from "rxjs";
import { IDataView } from "apollo-inspector";
import { CopyType, ICopyData, RecordingState } from "../types";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

export interface IOperationsTrackerHeaderProps {
  setSearchText: (text: string) => void;
  operationsState: IOperationsReducerState;
  onRecordStart: (selectedApolloClientIds: string[]) => Observable<IDataView>;
  onRecordStop: () => void;
  onCopy: (copyType: CopyType, data: ICopyData) => void;
  shouldStartRecordingOnMount?: boolean;
}

export const OperationsTrackerHeader = React.memo(
  (props: IOperationsTrackerHeaderProps) => {
    const classes = useStyles();
    const {
      openDescription,
      setOpenDescription,
      startRecording,
      stopRecording,
      debouncedFilter,
      clearApolloOperations,
      recordingState,
      operationsState,
      onCopy,
    } = useOperationsTrackerheader(props);

    return (
      <>
        <div className={classes.header}>
          <div className={classes.buttonContainer}>
            {renderInfoAndStartStopButton(
              { openDescription, recordingState },
              { classes, setOpenDescription, startRecording, stopRecording }
            )}
            <CopyButton operationsState={operationsState} onCopy={onCopy} />
            {recordingState === RecordingState.Initial ? null : (
              <Button
                style={{ margin: "0 0.5rem" }}
                onClick={clearApolloOperations}
              >
                Clear All
              </Button>
            )}
          </div>
          <div>
            <Search onSearchChange={debouncedFilter} />
          </div>
        </div>
        {openDescription && (
          <div className={classes.description}>
            It monitors changes in cache, fired mutations and
            activated/deactivated queries.
          </div>
        )}
      </>
    );
  }
);

const useToggleRecording = (props: IOperationsTrackerHeaderProps) => {
  const { onRecordStart, onRecordStop } = props;
  const trackerStore = React.useContext(TrackerStoreContext);
  const {
    setApolloOperationsData,
    setError,
    setRecordingState,
    setLoader,
    apolloOperationsData,
  } = useStore(
    trackerStore,
    useShallow((store) => ({
      setRecordingState: store.setRecordingState,
      setApolloOperationsData: store.setApolloOperationsData,
      setLoader: store.setLoader,
      setError: store.setError,
      store,
      apolloOperationsData: store.apolloOperationsData,
    }))
  );

  const { selectedApolloClientIds } = useStore(
    trackerStore,
    useShallow((store) => ({
      selectedApolloClientIds: store.selectedApolloClientIds,
      apolloClients: store.apolloClients,
    }))
  );
  const [stopTracking, setStopTracking] = useStore(
    trackerStore,
    useShallow((store) => [
      store.stopApolloInspectorTracking,
      store.setStopApolloInspectorTracking,
    ])
  );

  const startRecording = useStartRecording(
    selectedApolloClientIds,
    setError,
    onRecordStart,
    setApolloOperationsData,
    setLoader,
    setRecordingState,
    setStopTracking
  );

  const stopRecording = useStopRecording(
    stopTracking,
    setRecordingState,
    onRecordStop,
    setError,
    setLoader,
    apolloOperationsData
  );

  return { startRecording, stopRecording };
};

const useOperationsTrackerheader = (props: IOperationsTrackerHeaderProps) => {
  const { setSearchText, operationsState, onCopy } = props;
  const store = React.useContext(TrackerStoreContext);
  const [openDescription, setOpenDescription] = useStore(
    store,
    useShallow((store) => [store.openDescription, store.setOpenDescription])
  );
  const {
    recordingState,
    apollOperationsData,
    setApolloOperationsData,
    setRecordingState,
  } = useStore(
    store,
    useShallow((store) => ({
      recordingState: store.recordingState,
      apollOperationsData: store.apolloOperationsData,
      setApolloOperationsData: store.setApolloOperationsData,
      setRecordingState: store.setRecordingState,
    }))
  );

  const { startRecording, stopRecording } = useToggleRecording(props);

  const clearApolloOperations = useClearApolloOperations(
    setApolloOperationsData,
    recordingState,
    stopRecording,
    startRecording,
    setRecordingState
  );

  const showClear = !!apollOperationsData?.operations;

  const debouncedFilter = useDebouncedFilter(setSearchText);

  useStartRecordingOnMount(props, startRecording);

  return {
    openDescription,
    setOpenDescription,
    startRecording,
    stopRecording,
    debouncedFilter,
    showClear,
    clearApolloOperations,
    recordingState,
    operationsState,
    apollOperationsData,
    onCopy,
  };
};

interface IRenderInfoButtonParams {
  openDescription: boolean;
  recordingState: RecordingState;
}

interface IRenderInfoButtonServices {
  classes: any;
  setOpenDescription: ISetState<boolean>;
  startRecording: () => void;
  stopRecording: () => void;
}

const renderInfoAndStartStopButton = (
  { openDescription, recordingState }: IRenderInfoButtonParams,
  {
    classes,
    setOpenDescription,
    startRecording,
    stopRecording,
  }: IRenderInfoButtonServices
) => {
  const recordingString = getRecordingString(recordingState);

  return (
    <>
      <Button
        title="Information"
        tabIndex={0}
        className={classes.infoButton}
        onClick={() => setOpenDescription(!openDescription)}
      >
        <Info20Regular />
      </Button>
      <Button
        className={
          recordingState === RecordingState.RecordingStarted
            ? classes.stopRecordingButton
            : ""
        }
        onClick={
          recordingState !== RecordingState.RecordingStarted
            ? startRecording
            : stopRecording
        }
      >
        {recordingString}
      </Button>
    </>
  );
};

const getRecordingString = (recordingState: RecordingState) => {
  if (
    recordingState === RecordingState.Initial ||
    recordingState === RecordingState.RecordingStopped
  ) {
    return "Start Recording";
  } else {
    return "Stop Recording";
  }
};

const useStartRecordingOnMount = (
  props: IOperationsTrackerHeaderProps,
  startRecording: () => void
) => {
  const [initComplete, setInitComplete] = React.useState(false);
  const store = React.useContext(TrackerStoreContext);

  const {
    selectedApolloClientIds,
    setSelectedApolloClientIds,
    recordingState,
    apolloClients,
  } = useStore(
    store,
    useShallow((store) => ({
      selectedApolloClientIds: store.selectedApolloClientIds,
      setSelectedApolloClientIds: store.setSelectedApolloClientIds,
      error: store.error,
      recordingState: store.recordingState,
      apolloClients: store.apolloClients,
    }))
  );

  React.useEffect(() => {
    if (
      props.shouldStartRecordingOnMount &&
      recordingState !== RecordingState.RecordingStarted &&
      selectedApolloClientIds.length === 0 &&
      apolloClients.length !== 0 &&
      initComplete === false
    ) {
      const firstApolloClient = apolloClients[0];
      const selectedApolloClientIdsUpdated = selectedApolloClientIds.concat([]);
      selectedApolloClientIdsUpdated.push(firstApolloClient);
      setSelectedApolloClientIds(selectedApolloClientIdsUpdated);
      setInitComplete(true);
    }
  }, [
    initComplete,
    setInitComplete,
    props.shouldStartRecordingOnMount,
    recordingState,
    selectedApolloClientIds,
    setSelectedApolloClientIds,
    apolloClients,
  ]);

  React.useEffect(() => {
    if (initComplete === true) {
      startRecording();
    }
  }, [initComplete]);
};

const useDebouncedFilter = (setSearchText: (text: string) => void) =>
  React.useCallback(
    debounce((e: React.SyntheticEvent) => {
      const input = e.target as HTMLInputElement;
      setSearchText(input.value);
    }, 200),
    [setSearchText]
  );

const useClearApolloOperations = (
  setApolloOperationsData: ISetState<
    | import("/Users/jpsahoo/Personal/Projects/github/apollo-inspector/index").IDataView
    | null
  >,
  recordingState: RecordingState,
  stopRecording: () => void,
  startRecording: () => void,
  setRecordingState: ISetState<RecordingState>
) =>
  useCallback(() => {
    setApolloOperationsData(null);
    if (recordingState === RecordingState.RecordingStarted) {
      stopRecording();
      startRecording();
    } else {
      setRecordingState(RecordingState.Initial);
    }
  }, [
    setApolloOperationsData,
    stopRecording,
    startRecording,
    recordingState,
    setRecordingState,
  ]);

const useStopRecording = (
  stopTracking: () => void,
  setRecordingState: ISetState<RecordingState>,
  onRecordStop: () => void,
  setError: ISetState<IError>,
  setLoader: ISetState<ILoader>,
  apolloOperationsData: IDataView | null
) =>
  React.useCallback(() => {
    stopTracking();
    setRecordingState(RecordingState.RecordingStopped);
    onRecordStop();
    setError({ error: null, message: "", type: IErrorType.FullPage });
    setLoader({ loading: false, message: "" });
    if (!apolloOperationsData) {
      setRecordingState(RecordingState.Initial);
    }
  }, [
    stopTracking,
    setRecordingState,
    onRecordStop,
    setError,
    setLoader,
    apolloOperationsData,
  ]);

const useStartRecording = (
  selectedApolloClientIds: string[],
  setError: ISetState<IError>,
  onRecordStart: (selectedApolloClientIds: string[]) => Observable<IDataView>,
  setApolloOperationsData: ISetState<IDataView | null>,
  setLoader: ISetState<ILoader>,
  setRecordingState: ISetState<RecordingState>,
  setStopTracking: ISetState<() => void>
) =>
  React.useCallback(() => {
    if (selectedApolloClientIds.length === 0) {
      setError({
        error: new Error("No apolloClients selected"),
        message: "Please select atleast one apollo client",
        type: IErrorType.Normal,
      });
      setTimeout(() => {
        setError({
          error: null,
          message: "",
          type: IErrorType.Normal,
        });
      }, 2000);
      return;
    }

    const observable = onRecordStart(selectedApolloClientIds);
    const subscription = observable.subscribe({
      next: (data: IDataView) => {
        setApolloOperationsData(data);
        setLoader({ loading: false, message: "" });
      },
      error: () => {
        setRecordingState(RecordingState.RecordingStopped);
        setError({
          error: new Error("Something went wrong"),
          message: "Something went wrong",
          type: IErrorType.FullPage,
        });
        setLoader({ loading: false, message: "" });
        subscription.unsubscribe();
      },
      complete: () => {
        setRecordingState(RecordingState.RecordingStopped);
        setError({ error: null, message: "", type: IErrorType.FullPage });
        setLoader({ loading: false, message: "" });
        subscription.unsubscribe();
      },
    });
    setLoader({ loading: true, message: "Recording operations" });
    setRecordingState(RecordingState.RecordingStarted);
    setApolloOperationsData(null);
    const unsubscribe = () => subscription.unsubscribe();
    setStopTracking(() => unsubscribe);
  }, [
    setStopTracking,
    setApolloOperationsData,
    setRecordingState,
    setLoader,
    setError,
    onRecordStart,
    selectedApolloClientIds,
  ]);

OperationsTrackerHeader.displayName = "OperationsTrackerHeader";
