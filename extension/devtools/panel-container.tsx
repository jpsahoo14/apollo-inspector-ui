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
import { setupPanelActions } from "./setup-panel-actions";
import { Observable } from "rxjs";
import { IDataView } from "apollo-inspector";

const OperationsTrackerContainer = lazy(() => import("../../index"));

export const PanelContainer = () => {
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [clientIds, setClientIds] = React.useState<string[] | null>(null);
  const [subscription, setSubscription] = React.useState<{
    unsubscribe: () => void;
  } | null>(null);
  const [initPanelComplete, setInitPanelComplete] = React.useState(false);
  const tabIdRef = React.useRef(browser.devtools.inspectedWindow.tabId);
  const [backgroundConnection, setBackgroundConnection] =
    React.useState<browser.Runtime.Port | null>(null);
  const panelRef = React.useRef(new CustomEventTarget(PANEL_PAGE));

  usePanelInitialization({
    tabIdRef,
    panelRef,
    setBackgroundConnection,
    setInitPanelComplete,
    setClientIds,
    subscription,
    setSubscription,
  });

  useGetApolloClientIds(
    backgroundConnection,
    tabIdRef,
    panelRef,
    initPanelComplete
  );

  const { onRecordStart, onRecordStop, onCopy } = useOperationTrackerProps({
    subscription,
    panelRef,
    setSubscription,
    tabIdRef,
  });

  if (!initPanelComplete) {
    return <Spinner />;
  }

  if (!clientIds) {
    return <Spinner />;
  }

  if (!clientIds.length) {
    return <>No apollo Client founds</>;
  }

  return (
    <Suspense fallback={<Spinner />}>
      <OperationsTrackerContainer
        apolloClientIds={clientIds}
        onRecordStart={onRecordStart}
        onRecordStop={onRecordStop}
        onCopy={onCopy}
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
  const onRecordStart = React.useCallback(
    (clientIds: string[]) => {
      subscription?.unsubscribe();
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
    [setSubscription, subscription, tabIdRef, panelRef]
  );

  const onRecordStop = React.useCallback(() => {
    subscription?.unsubscribe();
    setSubscription(null);
    sendMessageViaEventTarget(panelRef.current, {
      action: PANEL_PAGE_ACTIONS.STOP_RECORDING,
      destinationName: WEB_PAGE,
      tabId: tabIdRef.current,
      callerName: PANEL_PAGE,
    });
  }, [subscription, panelRef, setSubscription, tabIdRef]);

  const onCopy = React.useCallback(() => {}, []);

  return { onRecordStart, onRecordStop, onCopy };
};

function useGetApolloClientIds(
  backgroundConnection: browser.Runtime.Port | null,
  tabIdRef: React.MutableRefObject<number>,
  panelRef: React.MutableRefObject<CustomEventTarget>,
  initPanelComplete: boolean
) {
  React.useEffect(() => {
    if (backgroundConnection && initPanelComplete) {
      sendMessageViaEventTarget(panelRef.current, {
        destinationName: WEB_PAGE,
        action: WEBPAGE_ACTIONS.GET_APOLLO_CLIENTS_IDS,
        tabId: tabIdRef.current,
        callerName: PANEL_PAGE,
      });
    }
  }, [backgroundConnection, panelRef, tabIdRef, initPanelComplete]);
}

interface IUseSetBackgroundConnection {
  setBackgroundConnection: React.Dispatch<
    React.SetStateAction<browser.Runtime.Port | null>
  >;
  panelRef: React.MutableRefObject<CustomEventTarget>;
  tabIdRef: React.MutableRefObject<number>;
  setInitPanelComplete: React.Dispatch<React.SetStateAction<boolean>>;
  setClientIds: React.Dispatch<React.SetStateAction<string[] | null>>;
  subscription: { unsubscribe: () => void } | null;
  setSubscription: React.Dispatch<
    React.SetStateAction<{ unsubscribe: () => void } | null>
  >;
}

function usePanelInitialization({
  panelRef,
  setBackgroundConnection,
  setClientIds,
  setInitPanelComplete,
  tabIdRef,
  setSubscription,
  subscription,
}: IUseSetBackgroundConnection) {
  const resetStore = React.useCallback(() => {
    setInitPanelComplete(false);
    setClientIds(null);
    subscription?.unsubscribe();
    setSubscription(null);
  }, [setInitPanelComplete, setClientIds]);

  const initPanel = React.useCallback(() => {
    setInitPanelComplete(true);
  }, [setInitPanelComplete]);

  React.useEffect(() => {
    const backgroundConnection = browser.runtime.connect({
      name: JSON.stringify({ name: PANEL_PAGE, tabId: tabIdRef.current }),
    });
    backgroundConnection.onMessage.addListener((message: IMessagePayload) => {
      logMessage(`message received at panel-container`, message);
      const event = new CustomEvent(message.destination.name, {
        detail: message,
      });
      panelRef.current.dispatchEvent(event);
    });
    setBackgroundConnection(backgroundConnection);

    setupPanelActions({
      backgroundConnection,
      panel: panelRef.current,
      setClientIds,
      tabId: tabIdRef.current,
      setInitPanelComplete,
      initPanel,
      resetStore,
    });
    initPanel();
    return () => {
      logMessage(`disconnecting`, {
        backgroundConnection: !!backgroundConnection,
      });
      backgroundConnection?.disconnect();
    };
  }, []);
}

const logMessage = createLogger(`panel-container`);
