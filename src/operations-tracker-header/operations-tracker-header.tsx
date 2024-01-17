import React, { useCallback } from "react";
import { Button, MenuButton, Menu, MenuPopover, MenuTrigger, MenuItem, MenuList } from "@fluentui/react-components";
import { Info20Regular } from "@fluentui/react-icons";
import { useStyles } from "./operations-tracker-header-styles";
import { Search } from "../search/search";
import { debounce } from "lodash-es";
import { CopyButton } from "./operations-copy-button";
import { IOperationsReducerState } from "../operations-tracker-container-helper";
import { TrackerStoreContext, ISetState, IErrorType } from "../store";
import { Observable } from "rxjs";
import { IDataView } from "apollo-inspector";
import { CopyType, ICopyData, RecordingState } from "../types";
import { useStore } from "zustand";

export interface IOperationsTrackerHeaderProps {
  setSearchText: (text: string) => void;
  operationsState: IOperationsReducerState;
  onRecordStart: (selectedApolloClientIds: string[]) => Observable<IDataView>;
  onRecordStop: () => void;
  onCopy: (copyType: CopyType, data: ICopyData) => void;
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
    const trackerStore = React.useContext(TrackerStoreContext);
    const {
      setTheme, theme
    } = useStore(trackerStore, (store) => ({
      setTheme: store.setTheme,
      theme: store.theme,
    }));

    const changeTheme = (e: any)=>{
      console.log(theme);
      setTheme(e.target.value)
    }
    return (
      <>
        <div className={classes.header}>
          <div className={classes.buttonContainer}>
            {renderInfoButton(
              { openDescription, recordingState },
              { classes, setOpenDescription, startRecording, stopRecording }
            )}
            <CopyButton operationsState={operationsState} onCopy={onCopy} />
            {recordingState === RecordingState.Initial ? null : (
              <Button
                style={{ marginLeft: "0.5rem" }}
                onClick={clearApolloOperations}
              >
                Clear All
              </Button>
            )}
             {recordingState === RecordingState.Initial ? null : (
              <Menu>
              <MenuTrigger> 
                <MenuButton>
                  Theme
                </MenuButton>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={(e) => changeTheme(e)}>light</MenuItem>
                  <MenuItem onClick={(e) => changeTheme(e)}>dark</MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
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
  } = useStore(trackerStore, (store) => ({
    setRecordingState: store.setRecordingState,
    setApolloOperationsData: store.setApolloOperationsData,
    setLoader: store.setLoader,
    setError: store.setError,
    store,
    apolloOperationsData: store.apolloOperationsData,
  }));

  const { selectedApolloClientIds } = useStore(trackerStore, (store) => ({
    selectedApolloClientIds: store.selectedApolloClientIds,
    apolloClients: store.apolloClients,
  }));
  const [stopTracking, setStopTracking] = useStore(trackerStore, (store) => [
    store.stopApolloInspectorTracking,
    store.setStopApolloInspectorTracking,
  ]);

  const startRecording = React.useCallback(() => {
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
        // const newData = cloneDeep(data);
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

  const stopRecording = React.useCallback(() => {
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

  return { startRecording, stopRecording };
};

const useOperationsTrackerheader = (props: IOperationsTrackerHeaderProps) => {
  const { setSearchText, operationsState, onCopy } = props;
  const store = React.useContext(TrackerStoreContext);
  const [openDescription, setOpenDescription] = useStore(store, (store) => [
    store.openDescription,
    store.setOpenDescription,
  ]);
  const {
    recordingState,
    apollOperationsData,
    setApolloOperationsData,
    setRecordingState,
  } = useStore(store, (store) => ({
    recordingState: store.recordingState,
    apollOperationsData: store.apolloOperationsData,
    setApolloOperationsData: store.setApolloOperationsData,
    setRecordingState: store.setRecordingState,
  }));

  const { startRecording, stopRecording } = useToggleRecording(props);

  const clearApolloOperations = useCallback(() => {
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

  const showClear = !!apollOperationsData?.operations;

  const debouncedFilter = React.useCallback(
    debounce((e: React.SyntheticEvent) => {
      const input = e.target as HTMLInputElement;
      setSearchText(input.value);
    }, 200),
    [setSearchText]
  );

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

const renderInfoButton = (
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
            ? classes.recordingButton
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

OperationsTrackerHeader.displayName = "OperationsTrackerHeader";
