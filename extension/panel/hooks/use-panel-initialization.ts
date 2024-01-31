import React from "react";
import browser from "webextension-polyfill";
import {
  CustomEventTarget,
  IMessagePayload,
  PANEL_PAGE,
  createLogger,
} from "../../utils";
import { setupPanelActions } from "../setup-panel-actions";

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
  cleanUpsRef: React.MutableRefObject<(() => void)[]>;
}
export const usePanelInitialization = ({
  panelRef,
  setBackgroundConnection,
  setClientIds,
  setInitPanelComplete,
  tabIdRef,
  setSubscription,
  cleanUpsRef,
}: IUseSetBackgroundConnection) => {
  const resetStore = useResetStore(
    setInitPanelComplete,
    setClientIds,
    setSubscription,
    cleanUpsRef
  );

  const initPanel = useInitPanel(cleanUpsRef, setInitPanelComplete);

  useConnectToBackgroundServiceWorker(
    tabIdRef,
    panelRef,
    setBackgroundConnection,
    setClientIds,
    setInitPanelComplete,
    initPanel,
    resetStore,
    cleanUpsRef
  );
};

const useResetStore = (
  setInitPanelComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setClientIds: React.Dispatch<React.SetStateAction<string[] | null>>,
  setSubscription: React.Dispatch<
    React.SetStateAction<{ unsubscribe: () => void } | null>
  >,
  cleanUpsRef: React.MutableRefObject<(() => void)[]>
) =>
  React.useCallback(() => {
    logMessage(`resetStore called`, { log: undefined });
    setInitPanelComplete(false);
    setClientIds(null);
    setSubscription((sub) => {
      sub?.unsubscribe();
      return null;
    });
    cleanUpsRef.current.forEach((cleanUp) => cleanUp());
    cleanUpsRef.current = [];
  }, [setInitPanelComplete, setClientIds, setSubscription]);

const useInitPanel = (
  cleanUpsRef: React.MutableRefObject<(() => void)[]>,
  setInitPanelComplete: React.Dispatch<React.SetStateAction<boolean>>
) =>
  React.useCallback(() => {
    logMessage(`initPanel called`, { log: undefined });
    cleanUpsRef.current.forEach((cleanUp) => cleanUp());
    cleanUpsRef.current = [];
    setInitPanelComplete(true);
  }, [setInitPanelComplete]);

const useConnectToBackgroundServiceWorker = (
  tabIdRef: React.MutableRefObject<number>,
  panelRef: React.MutableRefObject<CustomEventTarget>,
  setBackgroundConnection: React.Dispatch<
    React.SetStateAction<browser.Runtime.Port | null>
  >,
  setClientIds: React.Dispatch<React.SetStateAction<string[] | null>>,
  setInitPanelComplete: React.Dispatch<React.SetStateAction<boolean>>,
  initPanel: () => void,
  resetStore: () => void,
  cleanUpsRef: React.MutableRefObject<(() => void)[]>
) => {
  React.useEffect(() => {
    const backgroundConnection = connectToBackgroundServiceWorker(
      tabIdRef,
      panelRef,
      setBackgroundConnection,
      setClientIds,
      setInitPanelComplete,
      initPanel,
      resetStore,
      cleanUpsRef
    );

    initPanel();

    return () => {
      logMessage(`disconnecting`, {
        data: { backgroundConnection: !!backgroundConnection },
      });
      backgroundConnection?.disconnect();
    };
  }, []);
};

const connectToBackgroundServiceWorker = (
  tabIdRef: React.MutableRefObject<number>,
  panelRef: React.MutableRefObject<CustomEventTarget>,
  setBackgroundConnection: React.Dispatch<
    React.SetStateAction<browser.Runtime.Port | null>
  >,
  setClientIds: React.Dispatch<React.SetStateAction<string[] | null>>,
  setInitPanelComplete: React.Dispatch<React.SetStateAction<boolean>>,
  initPanel: () => void,
  resetStore: () => void,
  cleanUpsRef: React.MutableRefObject<(() => void)[]>
) => {
  const onDisconnectCleanUps: (() => void)[] = [];

  const backgroundConnection = browser.runtime.connect({
    name: JSON.stringify({ name: PANEL_PAGE, tabId: tabIdRef.current }),
  });
  backgroundConnection.onMessage.addListener((message: IMessagePayload) => {
    logMessage(`message received at panel-container`, { message });
    const event = new CustomEvent(message.destination.name, {
      detail: message,
    });
    panelRef.current.dispatchEvent(event);
  });
  setBackgroundConnection(backgroundConnection);
  onDisconnectCleanUps.push(
    setupPanelActions({
      backgroundConnection,
      panel: panelRef.current,
      setClientIds,
      tabId: tabIdRef.current,
      setInitPanelComplete,
      initPanel,
      resetStore,
      cleanUpsRef,
    })
  );
  backgroundConnection.onDisconnect.addListener((port) => {
    logMessage(`panel-container disconnected from background`, {
      data: port,
    });
    onDisconnectCleanUps.forEach((cleanUp) => cleanUp());
    connectToBackgroundServiceWorker(
      tabIdRef,
      panelRef,
      setBackgroundConnection,
      setClientIds,
      setInitPanelComplete,
      initPanel,
      resetStore,
      cleanUpsRef
    );
  });
  return backgroundConnection;
};

const logMessage = createLogger(`panel-container`);
