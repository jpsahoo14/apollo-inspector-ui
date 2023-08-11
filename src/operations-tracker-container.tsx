import React, { useState, useEffect, useCallback } from "react";
import { IDataView, ApolloInspector, OperationType, ResultsFrom, OperationStatus } from "apollo-inspector";
import { mergeClasses, Spinner, Title2 } from "@fluentui/react-components";
import { OperationsTrackerBody } from "./operations-tracker-body/operations-tracker-body";
import { useStyles } from "./operations-tracker-container-styles";
import { OperationsTrackerHeader } from "./operations-tracker-header/operations-tracker-header";
import {
  IError,
  ILoader,
  IUseMainSlotParams,
  IUseMainSlotService,
} from "./operations-tracker-container.interface";
import { ErrorBoundary } from "./operation-tracker-error-boundary";
import {
  getInitialState,
  OperationReducerActionEnum,
  reducers,
} from "./operations-tracker-container-helper";
import { ApolloClientsObject, ClientObject } from "./types";
import { useTrackerStore, ISetState } from "./store";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import jsonOperationsData1 from "./operationsDataJson.json";

interface IOperationsTrackerContainer {
  apolloClients?: ApolloClientsObject;
}
export const OperationsTrackerContainer = (
  props: IOperationsTrackerContainer
) => {
  const [openDescription, setOpenDescription] = useState<boolean>(false);
  const [showSearchBanner, setShowSearchBanner] = useState<boolean>(false);
  const [searchString, setSearchString] = useState('');
  const [apollOperationsData, setApolloOperationsData] = useTrackerStore(
    (store) => [store.apollOperationsData, store.setApolloOperationsData]
  );
  const [loader, setLoader] = useTrackerStore((store) => [
    store.loader,
    store.setLoader,
  ]);
  const [error, setError] = React.useState<IError | null>(null);
  const [isRecording, setIsRecording] = useTrackerStore((store) => [
    store.isRecording,
    store.setIsRecording,
  ]);

  // ?????
  const [operationsState, dispatchOperationsState] = React.useReducer(
    reducers,
    getInitialState()
  );

  const classes = useStyles();
  // useSubscribeToPublisher(setError, setApolloOperationsData, setLoader);
  // useSetSelectedApolloClient(props);

  const toggleRecording = useToggleRecording(
    isRecording,
    setIsRecording,
    setApolloOperationsData,
    setLoader,
    setError
  );
  // ?????
  React.useMemo(() => {
    return null;
  }, [operationsState]);

  const clearApolloOperations = useCallback(() => {
    setApolloOperationsData(null);
  }, [setApolloOperationsData]);

  const mainSlot = useMainSlot(
    {
      error,
      loader,
      apollOperationsData,
      operationsState,
      dispatchOperationsState,
      showSearchBanner,
      searchString
    },
    { classes }
  );

  const setSearchText = React.useCallback(
    (text: string) => {
      if(text)
      {
        setShowSearchBanner(true);
        setSearchString(text);
      }
      else
      setShowSearchBanner(false);
      
      dispatchOperationsState({
        type: OperationReducerActionEnum.UpdateSearchText,
        value: text,
      });
    },
    [dispatchOperationsState]
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
            isRecording={isRecording}
            openDescription={openDescription}
            setOpenDescription={setOpenDescription}
            toggleRecording={toggleRecording}
            setSearchText={setSearchText}
            operationsState={operationsState}
            apollOperationsData={apollOperationsData}
            clearApolloOperations={clearApolloOperations}
            showClear={!!apollOperationsData?.verboseOperations}
          />
          {mainSlot}
        </div>
      </div>
    </ErrorBoundary>
  );
};

const useSetSelectedApolloClient = (props: IOperationsTrackerContainer) => {
  const [setApolloClients, selectedApolloClientId, setSelectedApolloClientId] =
    useTrackerStore((store) => [
      store.setApolloClients,
      store.selectedApolloClientId,
      store.setSelectedApolloClientId,
    ]);

  React.useEffect(() => {
    const currentApolloClients =
      props.apolloClients || getApolloClientFromWindow();
    setApolloClients(currentApolloClients);
    if (selectedApolloClientId) {
      if (!currentApolloClients.hasOwnProperty(selectedApolloClientId)) {
        setSelectedApolloClientId(Object.keys(currentApolloClients)[0]);
      }
    } else {
      setSelectedApolloClientId(Object.keys(currentApolloClients)[0]);
    }
  }, [props.apolloClients, setApolloClients, selectedApolloClientId]);
};

const useMainSlot = (
  {
    apollOperationsData,
    error,
    loader,
    dispatchOperationsState,
    operationsState,
    showSearchBanner,
    searchString
  }: IUseMainSlotParams,
  { classes }: IUseMainSlotService
) => {
  if (error) {
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

  if (!!!apollOperationsData?.verboseOperations)
  {
    return(<div>
      <h2>Please select below configs:</h2>
      <DropDownList />
      </div>);
  }
  
  
  return (
    <>
    {showSearchBanner && <h3>Results are filtered by search text - {searchString}</h3>}
    <OperationsTrackerBody
      dispatchOperationsState={dispatchOperationsState}
      data={apollOperationsData}
      operationsState={operationsState}
    />
    </>
  );
};

const useToggleRecording = (
  isRecording: Boolean,
  setIsRecording: ISetState<boolean>,
  setApolloOperationsData: ISetState<IDataView | null>,
  setLoader: ISetState<ILoader>,
  setError: React.Dispatch<React.SetStateAction<IError | null>>
) => {
  const [selectedApolloClientId, apolloClients] = useTrackerStore((store) => [
    store.selectedApolloClientId,
    store.apolloClients,
  ]);
  const [stopTracking, setStopTracking] = useTrackerStore((store) => [
    store.stopApolloInspectorTracking,
    store.setStopApolloInspectorTracking,
  ]);
  return useCallback(() => {
    // setLoader({ message: "Recording operations", loading: true });
    if (!isRecording) {
      const apolloInspector = new ApolloInspector(
        apolloClients[selectedApolloClientId]
      );
      //const stopTracking = apolloInspector.startTracking();
      // const stopTracking = {};
      setStopTracking(stopTracking);
      setApolloOperationsData(null);
      setLoader({ message: "Recording operations", loading: true });
      setError(null);
    } else {
      //stopTracking();
      setLoader({ message: "", loading: false });
      setApolloOperationsData(jsonOperationsData1);
      // setLoader({ message: "Processing operations", loading: true });
    }
    setIsRecording(!isRecording);
    //setIsRecording?.((isRecording) => {
      // if (!isRecording) {
      //   const apolloInspector = new ApolloInspector(
      //     apolloClients[selectedApolloClientId]
      //   );
      //   //const stopTracking = apolloInspector.startTracking();
      //   // const stopTracking = {};
      //   setStopTracking(stopTracking);
      //   setApolloOperationsData(null);
      //   setLoader({ message: "Recording operations", loading: true });
      //   setError(null);
      // } else {
      //   stopTracking();
      //   setApolloOperationsData(jsonData);
      //   setLoader({ message: "Processing operations", loading: true });
      // }
    //  return !isRecording;
    //});
  }, [
    isRecording,
    setIsRecording,
    stopTracking,
    selectedApolloClientId,
    apolloClients,
    setStopTracking,
  ]);
};

const useSubscribeToPublisher = (
  setError: React.Dispatch<React.SetStateAction<IError | null>>,
  setApolloOperationsData: ISetState<IDataView | null>,
  setLoader: ISetState<ILoader>
) => {
  useEffect(() => {
    // remplSubscriber
    //   .ns("apollo-operations-tracker")
    //   .subscribe((data: IDataView) => {
    //     if (data && (data as any).message) {
    //       const typedData = data as any;
    //       setError({ error: typedData.error, message: typedData.message });
    //       setLoader({ message: "", loading: false });
    //       return;
    //     }
    //     setApolloOperationsData(data);
    //     setLoader({ message: "", loading: false });
    //   });
  }, []);
};

const getApolloClientFromWindow = (): ApolloClientsObject => {
  const apolloClients: ApolloClientsObject = {};
  window.__APOLLO_CLIENTS__?.forEach((value: ClientObject) => {
    apolloClients[value.clientId] = value.client;
  });

  return apolloClients;
};

function DropDownList() {
  const [selectedOption, setSelectedOption] = useState('core');
  const [selectedApolloClientId, setSelectedApolloClientId, apolloClients, setApolloClients] = useTrackerStore((store) => [
    store.selectedApolloClientId,
    store.setSelectedApolloClientId,
    store.apolloClients,
    store.setApolloClients
  ]);

  const temp1 : ApolloClient<NormalizedCacheObject> = {};
  const temp : ApolloClientsObject = {["core"]: temp1, ["abc"]: temp1};
  // apolloClients = temp;
//   React.useMemo(() => { 
//     const temp1 : ApolloClient<NormalizedCacheObject> = {};
//     const temp : ApolloClientsObject = {["core"]: temp1};
//     setApolloClients(temp);
// }, [setApolloClients]);
  
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectedApolloClientId(event.target.value);
  };

  return (
    <div>
      <label htmlFor="dropdown">Apollo client : </label>
      <select id="dropdown" value={selectedOption} onChange={handleOptionChange}>
      {Object.keys(temp).map((key, index) => (
          <option key={index} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
}
