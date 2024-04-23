import React, { lazy, Suspense } from "react";
import browser from "webextension-polyfill";
import { Spinner } from "@fluentui/react-components";
import {
  CustomEventTarget,
  IMessagePayload,
  PANEL_PAGE_ACTIONS,
  WEBPAGE_ACTIONS,
  createLogger,
  sendMessageViaEventTarget,
  Context,
  Default_Apollo_Client_Name,
} from "../utils";
import { Observable } from "rxjs";
import { IDataView, IVerboseOperation } from "apollo-inspector";
import { CopyType, ICopyData } from "../../../src/types";
import copy from "copy-to-clipboard";
import { usePanelInitialization } from "./hooks";
import { IDataViewMap } from "./panel.interface";

const OperationsTracker = lazy(() => import("../../../index"));

export const PanelContainer = () => {
  const [clientIds, setClientIds] = React.useState<string[] | null>(null);
  const [isRecording, setIsRecording] = React.useState<boolean | null>(null);
  const [subscription, setSubscription] = React.useState<{
    unsubscribe: () => void;
  } | null>(null);
  const [initPanelComplete, setInitPanelComplete] = React.useState(false);
  const tabIdRef = React.useRef(browser.devtools.inspectedWindow.tabId);
  const cleanUpsRef = React.useRef<(() => void)[]>([]);
  const [backgroundConnection, setBackgroundConnection] =
    React.useState<browser.Runtime.Port | null>(null);
  const panelEventTargetRef = React.useRef(
    new CustomEventTarget(Context.PANEL_PAGE)
  );

  logMessage(`rendering Panel container`, {
    log: {
      clientIds,
      subscription: !!subscription,
      initPanelComplete,
      tabId: tabIdRef.current,
      cleanUps: cleanUpsRef.current.length,
      backgroundConnection: !!backgroundConnection,
    },
  });
  usePanelInitialization({
    tabIdRef,
    panelEventTargetRef: panelEventTargetRef,
    setBackgroundConnection,
    setInitPanelComplete,
    setClientIds,
    subscription,
    setSubscription,
    cleanUpsRef,
  });

  useGetApolloClientIds(
    backgroundConnection,
    tabIdRef,
    panelEventTargetRef,
    initPanelComplete,
    setClientIds,
    cleanUpsRef
  );

  const { onRecordStart, onRecordStop, onCopy, onClearStore, onResetStore } =
    useOperationTrackerProps({
      subscription,
      panelRef: panelEventTargetRef,
      setSubscription,
      tabIdRef,
      setIsRecording,
    });

  if (!initPanelComplete) {
    return (
      <>
        {"Devtools still loading"}
        <Spinner />
      </>
    );
  }

  if (!clientIds) {
    return (
      <>
        {"No Apollo clients found"}
        <Spinner />
      </>
    );
  }

  if (!clientIds.length) {
    return <>No apollo Client founds</>;
  }

  return (
    <Suspense
      fallback={
        <>
          {"Loading"}
          <Spinner />
        </>
      }
    >
      <OperationsTracker
        apolloClientIds={clientIds}
        onRecordStart={onRecordStart}
        onRecordStop={onRecordStop}
        onCopy={onCopy}
        clearStore={onClearStore}
        resetStore={onResetStore}
        shouldStartRecordingOnMount={
          clientIds[0] === Default_Apollo_Client_Name &&
          (isRecording === null || isRecording === true)
        }
      />
    </Suspense>
  );
};

interface IUeOperationTrackerProps {
  panelRef: React.MutableRefObject<CustomEventTarget>;
  subscription: { unsubscribe: () => void } | null;
  setSubscription: React.Dispatch<
    React.SetStateAction<{ unsubscribe: () => void } | null>
  >;
  tabIdRef: React.MutableRefObject<number>;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean | null>>;
}
const useOperationTrackerProps = ({
  panelRef,
  setSubscription,
  subscription,
  tabIdRef,
  setIsRecording,
}: IUeOperationTrackerProps) => {
  const { onClearStore, onResetStore } = useApolloClientStoreCB(
    panelRef,
    tabIdRef
  );
  const { onRecordStart, onRecordStop } = useOnRecordStartAndOnRecordStop(
    subscription,
    panelRef,
    setSubscription,
    tabIdRef,
    setIsRecording
  );

  const onCopy = React.useCallback((copyType: CopyType, data: ICopyData) => {
    if (copyType === CopyType.WholeApolloCache) {
      sendMessageViaEventTarget(panelRef.current, {
        action: PANEL_PAGE_ACTIONS.COPY_WHOLE_CACHE,
        callerName: Context.PANEL_PAGE,
        destinationName: Context.WEB_PAGE,
        tabId: tabIdRef.current,
        data,
      });
      return;
    }
    const { operations } = data;
    const copiedData = JSON.stringify(operations);
    copy(copiedData);
    return;
  }, []);

  return { onRecordStart, onRecordStop, onCopy, onClearStore, onResetStore };
};

const useApolloClientStoreCB = (
  panelRef: React.MutableRefObject<CustomEventTarget>,
  tabIdRef: React.MutableRefObject<number>
) => {
  const onClearStore = React.useCallback((clientId: string) => {
    sendMessageViaEventTarget(panelRef.current, {
      action: PANEL_PAGE_ACTIONS.CLEAR_STORE,
      callerName: Context.PANEL_PAGE,
      destinationName: Context.WEB_PAGE,
      tabId: tabIdRef.current,
      data: {
        clientId,
      },
    });
  }, []);
  const onResetStore = React.useCallback((clientId: string) => {
    sendMessageViaEventTarget(panelRef.current, {
      action: PANEL_PAGE_ACTIONS.RESET_STORE,
      callerName: Context.PANEL_PAGE,
      destinationName: Context.WEB_PAGE,
      tabId: tabIdRef.current,
      data: {
        clientId,
      },
    });
  }, []);
  return { onClearStore, onResetStore };
};

const useGetApolloClientIds = (
  backgroundConnection: browser.Runtime.Port | null,
  tabIdRef: React.MutableRefObject<number>,
  panelRef: React.MutableRefObject<CustomEventTarget>,
  initPanelComplete: boolean,
  setClientIds: React.Dispatch<React.SetStateAction<string[] | null>>,
  cleanUpsRef: React.MutableRefObject<(() => void)[]>
) => {
  React.useEffect(() => {
    if (backgroundConnection && initPanelComplete) {
      const startTime = Date.now();
      const fetchUntil = 10000;
      const intervalNumber = setInterval(() => {
        sendMessageViaEventTarget(panelRef.current, {
          destinationName: Context.WEB_PAGE,
          action: WEBPAGE_ACTIONS.GET_APOLLO_CLIENTS_IDS,
          tabId: tabIdRef.current,
          callerName: Context.PANEL_PAGE,
        });
      }, 100);

      const removeListener = panelRef.current.addEventListener(
        WEBPAGE_ACTIONS.APOLLO_CLIENT_IDS,
        (message: IMessagePayload) => {
          const apolloClientsIds = message.data.apolloClientsIds;

          if (Date.now() - startTime > fetchUntil) {
            clearInterval(intervalNumber);
            removeListener();

            return;
          }
          setClientIds(apolloClientsIds);
        }
      );

      const timeoutNum = setTimeout(() => {
        clearInterval(intervalNumber);
      }, fetchUntil);

      const cleanUp = () => {
        removeListener();
        clearInterval(intervalNumber);
        clearTimeout(timeoutNum);
      };
      cleanUpsRef.current.push(cleanUp);
      return () => {
        cleanUp();
      };
    }
  }, [
    backgroundConnection,
    panelRef,
    tabIdRef,
    initPanelComplete,
    setClientIds,
  ]);
};

const useOnRecordStartAndOnRecordStop = (
  subscription: { unsubscribe: () => void } | null,
  panelRef: React.MutableRefObject<CustomEventTarget>,
  setSubscription: React.Dispatch<
    React.SetStateAction<{ unsubscribe: () => void } | null>
  >,
  tabIdRef: React.MutableRefObject<number>,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean | null>>
) => {
  const dataViewRef = React.useRef<IDataViewMap | null>(null);
  const onRecordStart = useOnRecordStart(
    setSubscription,
    panelRef,
    tabIdRef,
    dataViewRef,
    setIsRecording
  );

  const onRecordStop = useOnRecordStop(
    setSubscription,
    panelRef,
    tabIdRef,
    dataViewRef,
    setIsRecording
  );
  return { onRecordStart, onRecordStop };
};

const combineDataViewFromSubscriptionToDataViewRef = (
  dataViewRef: React.MutableRefObject<IDataViewMap | null>,
  data: IDataView
) => {
  if (!dataViewRef.current) {
    const operationsMap = new Map<number, IVerboseOperation>();
    const verboseOperationsMap = new Map<number, IVerboseOperation>();

    data.operations?.forEach((op) => {
      operationsMap.set(op.id, op);
    });

    data.verboseOperations?.forEach((op) => {
      verboseOperationsMap.set(op.id, op);
    });

    dataViewRef.current = {
      operationsMap,
      verboseOperationsMap,
    };

    return data;
  }
  const operationsMap = dataViewRef.current.operationsMap;
  const verboseOperationsMap = dataViewRef.current.verboseOperationsMap;

  data.operations?.forEach((op) => {
    operationsMap.set(op.id, op);
  });

  data.verboseOperations?.forEach((op) => {
    verboseOperationsMap.set(op.id, op);
  });

  data.operations = Array.from(dataViewRef.current.operationsMap.values()).sort(
    (a, b) => a.id - b.id
  );

  data.verboseOperations = Array.from(
    dataViewRef.current.verboseOperationsMap.values()
  ).sort((a, b) => a.id - b.id);

  return data;
};

const useOnRecordStop = (
  setSubscription: React.Dispatch<
    React.SetStateAction<{ unsubscribe: () => void } | null>
  >,
  panelRef: React.MutableRefObject<CustomEventTarget>,
  tabIdRef: React.MutableRefObject<number>,
  dataViewRef: React.MutableRefObject<IDataViewMap | null>,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean | null>>
) =>
  React.useCallback(() => {
    setSubscription((sub) => {
      sub?.unsubscribe();
      return null;
    });
    dataViewRef.current = null;
    setIsRecording(false);
    sendMessageViaEventTarget(panelRef.current, {
      action: PANEL_PAGE_ACTIONS.STOP_RECORDING,
      destinationName: Context.WEB_PAGE,
      tabId: tabIdRef.current,
      callerName: Context.PANEL_PAGE,
    });
  }, [panelRef, setSubscription, tabIdRef, setIsRecording]);

const useOnRecordStart = (
  setSubscription: React.Dispatch<
    React.SetStateAction<{ unsubscribe: () => void } | null>
  >,
  panelRef: React.MutableRefObject<CustomEventTarget>,
  tabIdRef: React.MutableRefObject<number>,
  dataViewRef: React.MutableRefObject<IDataViewMap | null>,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean | null>>
) =>
  React.useCallback(
    (clientIds: string[]) => {
      setSubscription((sub) => {
        sub?.unsubscribe();
        return sub;
      });
      dataViewRef.current = null;
      setIsRecording(true);
      return new Observable<IDataView>((observer) => {
        const unsubscribe = panelRef.current.addEventListener(
          WEBPAGE_ACTIONS.APOLLO_INSPECTOR_DATA,
          (message: IMessagePayload) => {
            const updatedData = combineDataViewFromSubscriptionToDataViewRef(
              dataViewRef,
              message.data
            );
            observer.next(updatedData);
          }
        );
        setSubscription({ unsubscribe });
        sendMessageViaEventTarget(panelRef.current, {
          action: PANEL_PAGE_ACTIONS.START_RECORDING,
          destinationName: Context.WEB_PAGE,
          tabId: tabIdRef.current,
          callerName: Context.PANEL_PAGE,
          data: {
            apolloClientIds: clientIds,
          },
        });

        sendMessageViaEventTarget(panelRef.current, {
          action: WEBPAGE_ACTIONS.GET_ACTIVE_WATCH_QUERIES,
          destinationName: Context.WEB_PAGE,
          tabId: tabIdRef.current,
          callerName: Context.PANEL_PAGE,
          data: {
            clientId: clientIds[0],
          },
        });
      });
    },
    [setSubscription, tabIdRef, panelRef, setIsRecording]
  );

const logMessage = createLogger(`panel-container`);
