import React, { lazy, Suspense } from "react";
import browser from "webextension-polyfill";
import { Spinner } from "@fluentui/react-components";
import {
  CustomEventTarget,
  IMessagePayload,
  PANEL_PAGE,
  PANEL_PAGE_ACTIONS,
  WEBPAGE_ACTIONS,
  WEB_PAGE,
  createLogger,
  sendMessageViaEventTarget,
} from "../utils";
import { Observable } from "rxjs";
import { IDataView } from "apollo-inspector";
import { CopyType, ICopyData } from "../../src/types";
import copy from "copy-to-clipboard";
import { usePanelInitialization } from "./hooks";

const OperationsTrackerContainer = lazy(() => import("../../index"));

export const PanelContainer = () => {
  const [clientIds, setClientIds] = React.useState<string[] | null>(null);
  const [subscription, setSubscription] = React.useState<{
    unsubscribe: () => void;
  } | null>(null);
  const [initPanelComplete, setInitPanelComplete] = React.useState(false);
  const tabIdRef = React.useRef(browser.devtools.inspectedWindow.tabId);
  const cleanUpsRef = React.useRef<(() => void)[]>([]);
  const [backgroundConnection, setBackgroundConnection] =
    React.useState<browser.Runtime.Port | null>(null);
  const panelRef = React.useRef(new CustomEventTarget(PANEL_PAGE));

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
    panelRef,
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
    panelRef,
    initPanelComplete,
    setClientIds,
    cleanUpsRef
  );

  const { onRecordStart, onRecordStop, onCopy, onClearStore, onResetStore } =
    useOperationTrackerProps({
      subscription,
      panelRef,
      setSubscription,
      tabIdRef,
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
      <OperationsTrackerContainer
        apolloClientIds={clientIds}
        onRecordStart={onRecordStart}
        onRecordStop={onRecordStop}
        onCopy={onCopy}
        clearStore={onClearStore}
        resetStore={onResetStore}
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
}
const useOperationTrackerProps = ({
  panelRef,
  setSubscription,
  subscription,
  tabIdRef,
}: IUeOperationTrackerProps) => {
  const { onClearStore, onResetStore } = useApolloClientStoreCB(
    panelRef,
    tabIdRef
  );
  const { onRecordStart, onRecordStop } = useOnRecordStartAndOnRecordStop(
    subscription,
    panelRef,
    setSubscription,
    tabIdRef
  );

  const onCopy = React.useCallback((copyType: CopyType, data: ICopyData) => {
    if (copyType === CopyType.WholeApolloCache) {
      sendMessageViaEventTarget(panelRef.current, {
        action: PANEL_PAGE_ACTIONS.COPY_WHOLE_CACHE,
        callerName: PANEL_PAGE,
        destinationName: WEB_PAGE,
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
      callerName: PANEL_PAGE,
      destinationName: WEB_PAGE,
      tabId: tabIdRef.current,
      data: {
        clientId,
      },
    });
  }, []);
  const onResetStore = React.useCallback((clientId: string) => {
    sendMessageViaEventTarget(panelRef.current, {
      action: PANEL_PAGE_ACTIONS.RESET_STORE,
      callerName: PANEL_PAGE,
      destinationName: WEB_PAGE,
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
          destinationName: WEB_PAGE,
          action: WEBPAGE_ACTIONS.GET_APOLLO_CLIENTS_IDS,
          tabId: tabIdRef.current,
          callerName: PANEL_PAGE,
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
  tabIdRef: React.MutableRefObject<number>
) => {
  const onRecordStart = React.useCallback(
    (clientIds: string[]) => {
      setSubscription((sub) => {
        sub?.unsubscribe();
        return sub;
      });
      return new Observable<IDataView>((observer) => {
        const unsubscribe = panelRef.current.addEventListener(
          WEBPAGE_ACTIONS.APOLLO_INSPECTOR_DATA,
          (message: IMessagePayload) => {
            observer.next(message.data);
          }
        );
        setSubscription({ unsubscribe });
        sendMessageViaEventTarget(panelRef.current, {
          action: PANEL_PAGE_ACTIONS.START_RECORDING,
          destinationName: WEB_PAGE,
          tabId: tabIdRef.current,
          callerName: PANEL_PAGE,
          data: {
            apolloClientIds: clientIds,
          },
        });
      });
    },
    [setSubscription, tabIdRef, panelRef]
  );

  const onRecordStop = React.useCallback(() => {
    setSubscription((sub) => {
      sub?.unsubscribe();
      return null;
    });
    sendMessageViaEventTarget(panelRef.current, {
      action: PANEL_PAGE_ACTIONS.STOP_RECORDING,
      destinationName: WEB_PAGE,
      tabId: tabIdRef.current,
      callerName: PANEL_PAGE,
    });
  }, [panelRef, setSubscription, tabIdRef]);
  return { onRecordStart, onRecordStop };
};

const logMessage = createLogger(`panel-container`);
