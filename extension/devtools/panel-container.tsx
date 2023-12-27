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
  generateRequestId,
} from "../utils";
import { setupPanelActions } from "./setup-panel-actions";
import { Observable } from "rxjs";
import { IDataView } from "apollo-inspector";

const OperationsTrackerContainer = lazy(() => import("../../index"));

export const PanelContainer = () => {
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [subscription, setSubscription] = React.useState<{
    unsubscribe: () => void;
  } | null>(null);
  const [isPanelVisible, setIsPanelVisible] = React.useState(true);
  const tabIdRef = React.useRef(browser.devtools.inspectedWindow.tabId);
  const [backgroundConnection, setBackgroundConnection] =
    React.useState<browser.Runtime.Port | null>(null);
  const panelRef = React.useRef(new CustomEventTarget(PANEL_PAGE));
  const { clientIds } = usePanelActions({
    backgroundConnection,
    panelRef,
    tabIdRef,
  });

  useSetBackgroundConnection(tabIdRef, panelRef, setBackgroundConnection);

  useGetApolloClientIds(backgroundConnection, tabIdRef, panelRef);

  const { onRecordStart, onRecordStop, onCopy } = useOperationTrackerProps({
    subscription,
    panelRef,
    setSubscription,
    tabIdRef,
  });

  if (!clientIds.length) {
    <Spinner />;
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

interface IUsePanelAction {
  backgroundConnection: browser.Runtime.Port | null;
  panelRef: React.MutableRefObject<CustomEventTarget>;
  tabIdRef: React.MutableRefObject<number>;
}
export const usePanelActions = ({
  backgroundConnection,
  panelRef,
  tabIdRef,
}: IUsePanelAction) => {
  const [clientIds, setClientIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!backgroundConnection) {
      return;
    }
    setupPanelActions({
      backgroundConnection,
      panel: panelRef.current,
      setClientIds,
      tabId: tabIdRef.current,
    });
  }, [backgroundConnection, setClientIds, panelRef, tabIdRef]);

  return { clientIds };
};

interface IUeOperationTrackerProps {
  subscription: { unsubscribe: () => void } | null;
  panelRef: React.MutableRefObject<CustomEventTarget>;
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
        const message: IMessagePayload = {
          requestInfo: {
            requestId: generateRequestId(PANEL_PAGE),
          },
          destination: {
            action: PANEL_PAGE_ACTIONS.START_RECORDING,
            name: WEB_PAGE,
            tabId: tabIdRef.current,
          },
          data: {
            apolloClientIds: clientIds,
          },
        };

        const event = new CustomEvent(message.destination.name, {
          detail: message,
        });
        panelRef.current.dispatchEvent(event);
      });
    },
    [setSubscription, subscription, tabIdRef, panelRef]
  );

  const onRecordStop = React.useCallback(() => {
    subscription?.unsubscribe();
    setSubscription(null);
    const message: IMessagePayload = {
      requestInfo: {
        requestId: generateRequestId(PANEL_PAGE),
      },
      destination: {
        action: PANEL_PAGE_ACTIONS.STOP_RECORDING,
        name: WEB_PAGE,
        tabId: tabIdRef.current,
      },
    };

    const event = new CustomEvent(message.destination.name, {
      detail: message,
    });
    panelRef.current.dispatchEvent(event);
  }, [subscription, panelRef, setSubscription, tabIdRef]);

  const onCopy = React.useCallback(() => {}, []);

  return { onRecordStart, onRecordStop, onCopy };
};

function useGetApolloClientIds(
  backgroundConnection: browser.Runtime.Port | null,
  tabIdRef: React.MutableRefObject<number>,
  panelRef: React.MutableRefObject<CustomEventTarget>
) {
  React.useEffect(() => {
    if (backgroundConnection) {
      const message: IMessagePayload = {
        destination: {
          name: WEB_PAGE,
          action: WEBPAGE_ACTIONS.GET_APOLLO_CLIENTS_IDS,
          tabId: tabIdRef.current,
        },
        requestInfo: {
          requestId: generateRequestId(PANEL_PAGE),
        },
      };
      const event = new CustomEvent(WEB_PAGE, { detail: message });
      panelRef.current.dispatchEvent(event);
    }
  }, [backgroundConnection, panelRef, tabIdRef]);
}

function useSetBackgroundConnection(
  tabIdRef: React.MutableRefObject<number>,
  panelRef: React.MutableRefObject<CustomEventTarget>,
  setBackgroundConnection: React.Dispatch<
    React.SetStateAction<browser.Runtime.Port | null>
  >
) {
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

    return () => {
      logMessage(`disconnecting`, {
        backgroundConnection: !!backgroundConnection,
      });
      backgroundConnection?.disconnect();
    };
  }, []);
}

function logMessage(message: string, data: any) {
  console.log(`[panel-container]AIE ${message}`, { data });
}
