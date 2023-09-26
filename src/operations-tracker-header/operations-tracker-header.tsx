import React, { useCallback } from "react";
import { Button } from "@fluentui/react-components";
import { Info20Regular } from "@fluentui/react-icons";
import { useStyles } from "./operations-tracker-header-styles";
import { Search } from "../search/search";
import { debounce } from "lodash";
import { CopyButton } from "./operations-copy-button";
import { IOperationsReducerState } from "../operations-tracker-container-helper";
import { useTrackerStore, ISetState } from "../store";
import { Observable } from "rxjs";
import { IApolloClientObject, IDataView } from "apollo-inspector";

export interface IOperationsTrackerHeaderProps {
  setSearchText: (text: string) => void;
  operationsState: IOperationsReducerState;
  onRecordStart: (selectedApolloClientIds: string[]) => Observable<IDataView>;
  onRecordStop: () => void;
}

export const OperationsTrackerHeader = React.memo(
  (props: IOperationsTrackerHeaderProps) => {
    const classes = useStyles();
    const {
      openDescription,
      setOpenDescription,
      toggleRecording,
      debouncedFilter,
      showClear,
      clearApolloOperations,
      isRecording,
      operationsState,
      apollOperationsData,
    } = useOperationsTrackerheader(props);

    return (
      <>
        <div className={classes.header}>
          <div className={classes.buttonContainer}>
            {renderInfoButton(
              { openDescription, isRecording },
              { classes, setOpenDescription, toggleRecording }
            )}
            <CopyButton
              hideCopy={isRecording || !showClear}
              operationsState={operationsState}
              apolloOperationsData={apollOperationsData}
            />
            {isRecording || !showClear ? null : (
              <Button
                style={{ marginLeft: "0.5rem" }}
                onClick={clearApolloOperations}
                disabled={!showClear}
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
  const {
    setApolloOperationsData,
    setError,
    setIsRecording,
    setLoader,
    isRecording,
  } = useTrackerStore((store) => ({
    setIsRecording: store.setIsRecording,
    setApolloOperationsData: store.setApolloOperationsData,
    setLoader: store.setLoader,
    setError: store.setError,
    isRecording: store.isRecording,
  }));

  const { selectedApolloClientIds, apolloClients } = useTrackerStore(
    (store) => ({
      selectedApolloClientIds: store.selectedApolloClientIds,
      apolloClients: store.apolloClients,
    })
  );
  const [stopTracking, setStopTracking] = useTrackerStore((store) => [
    store.stopApolloInspectorTracking,
    store.setStopApolloInspectorTracking,
  ]);

  return useCallback(() => {
    if (!isRecording) {
      const apolloClientsObjs: IApolloClientObject[] = [];
      selectedApolloClientIds.forEach((apolloClientId) => {
        const apolloClientObj = apolloClients.find(
          (apolloClientObj) => apolloClientObj.cliendId == apolloClientId
        );
        if (apolloClientObj) {
          apolloClientsObjs.push(apolloClientObj);
        }
      });
      const observable = onRecordStart(selectedApolloClientIds);
      const subscription = observable.subscribe({
        next: (data: IDataView) => {
          setApolloOperationsData(data);
          setLoader({ loading: false, message: "" });
        },
        error: () => {
          setIsRecording(false);
          setError({ error: true, message: "Something went wrong" });
          setLoader({ loading: false, message: "" });
          subscription.unsubscribe();
        },
        complete: () => {
          setIsRecording(false);
          setError({ error: false, message: "" });
          setLoader({ loading: false, message: "" });
          subscription.unsubscribe();
        },
      });
      setLoader({ loading: true, message: "Recording operations" });
      setIsRecording(true);
      setApolloOperationsData(null);
      const unsubscribe = () => subscription.unsubscribe();
      setStopTracking(() => unsubscribe);
    } else {
      stopTracking();
      setIsRecording(false);
      onRecordStop();
      setError({ error: false, message: "" });
      setLoader({ loading: false, message: "" });
    }
  }, [
    isRecording,
    onRecordStart,
    selectedApolloClientIds,
    setError,
    setIsRecording,
    setLoader,
    stopTracking,
  ]);
};

const useOperationsTrackerheader = (props: IOperationsTrackerHeaderProps) => {
  const { setSearchText, operationsState } = props;

  const [openDescription, setOpenDescription] = useTrackerStore((store) => [
    store.openDescription,
    store.setOpenDescription,
  ]);
  const { isRecording, apollOperationsData, setApolloOperationsData } =
    useTrackerStore((store) => ({
      isRecording: store.isRecording,
      apollOperationsData: store.apollOperationsData,
      setApolloOperationsData: store.setApolloOperationsData,
    }));

  const toggleRecording = useToggleRecording(props);

  const clearApolloOperations = useCallback(() => {
    setApolloOperationsData(null);
  }, [setApolloOperationsData]);

  const showClear = !!apollOperationsData?.verboseOperations;

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
    toggleRecording,
    debouncedFilter,
    showClear,
    clearApolloOperations,
    isRecording,
    operationsState,
    apollOperationsData,
  };
};

interface IRenderInfoButtonParams {
  openDescription: boolean;
  isRecording: boolean;
}

interface IRenderInfoButtonServices {
  classes: any;
  setOpenDescription: ISetState<boolean>;
  toggleRecording: () => void;
}

const renderInfoButton = (
  { openDescription, isRecording }: IRenderInfoButtonParams,
  { classes, setOpenDescription, toggleRecording }: IRenderInfoButtonServices
) => (
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
      className={isRecording ? classes.recordingButton : ""}
      onClick={toggleRecording}
    >
      {isRecording ? "Stop" : "Record"}
    </Button>
  </>
);
