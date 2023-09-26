import React from "react";
import { mergeClasses, Spinner, Title2 } from "@fluentui/react-components";
import { OperationsTrackerBody } from "./operations-tracker-body/operations-tracker-body";
import { useStyles } from "./operations-tracker-container-styles";
import { OperationsTrackerHeader } from "./operations-tracker-header/operations-tracker-header";
import {
  IUseMainSlotParams,
  IUseMainSlotService,
} from "./operations-tracker-container.interface";
import { ErrorBoundary } from "./operation-tracker-error-boundary";
import {
  getInitialState,
  OperationReducerActionEnum,
  reducers,
} from "./operations-tracker-container-helper";
import { useTrackerStore } from "./store";
import { IApolloClientObject, IDataView } from "apollo-inspector";
import { Observable } from "rxjs";

interface IOperationsTrackerContainer {
  apolloClients: IApolloClientObject[];
  onCopy: () => void;
  onRecordStart: (selectedApolloClientIds: string[]) => Observable<IDataView>;
  onRecordStop: () => void;
}
export const OperationsTrackerContainer = (
  props: IOperationsTrackerContainer
) => {
  const classes = useStyles();
  const { apolloClients, onCopy, onRecordStart, onRecordStop } = props;
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
    const currentApolloClients = props.apolloClients;
    setApolloClients(currentApolloClients);
  }, [props.apolloClients]);

  React.useEffect(() => {
    const currentApolloClients = props.apolloClients;
    if (selectedApolloClientIds.length !== 0) {
      const finalSelectedApolloClientsIds: string[] = [];
      selectedApolloClientIds.forEach((apolloClientId) => {
        const result = currentApolloClients.find(
          (ac) => ac.cliendId === apolloClientId
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
    } else {
      setSelectedApolloClientIds([currentApolloClients[0].cliendId]);
    }
  }, [props.apolloClients, setApolloClients, selectedApolloClientIds]);
};

const useMainSlot = (
  { dispatchOperationsState, operationsState }: IUseMainSlotParams,
  { classes }: IUseMainSlotService
) => {
  const { apollOperationsData, error, loader } = useTrackerStore((store) => ({
    apollOperationsData: store.apollOperationsData,
    error: store.error,
    loader: store.loader,
  }));
  if (error.error) {
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
