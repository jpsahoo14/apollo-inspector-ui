import React from "react";
import browser from "webextension-polyfill";
import {
  CustomEventTarget,
  IMessagePayload,
  createLogger,
  Context,
} from "../../utils";
import { setupPanelActions } from "../setup-panel-actions";

interface IUseSetBackgroundConnection {
  setBackgroundConnection: React.Dispatch<
    React.SetStateAction<browser.Runtime.Port | null>
  >;
  panelEventTargetRef: React.MutableRefObject<CustomEventTarget>;
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
  panelEventTargetRef,
  setBackgroundConnection,
  setClientIds,
  setInitPanelComplete,
  tabIdRef,
  setSubscription,
  cleanUpsRef,
}: IUseSetBackgroundConnection) => {
  const resetStore = useResetStoreCb(
    setInitPanelComplete,
    setClientIds,
    setSubscription,
    cleanUpsRef
  );

  const initPanel = useInitPanelCb(cleanUpsRef, setInitPanelComplete);

  useConnectToBackgroundServiceWorker(
    tabIdRef,
    panelEventTargetRef,
    setBackgroundConnection,
    setClientIds,
    setInitPanelComplete,
    initPanel,
    resetStore,
    cleanUpsRef
  );
};

const useResetStoreCb = (
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

const useInitPanelCb = (
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
      try {
        backgroundConnection?.disconnect();
      } catch {}
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

  const connectionToBackground = browser.runtime.connect({
    name: JSON.stringify({ name: Context.PANEL_PAGE, tabId: tabIdRef.current }),
  });
  connectionToBackground.onMessage.addListener((message: IMessagePayload) => {
    logMessage(`message received at panel-container`, { message });
    const event = new CustomEvent(message.destination.action, {
      detail: message,
    });
    panelRef.current.dispatchEvent(event);
  });
  setBackgroundConnection(connectionToBackground);

  onDisconnectCleanUps.push(
    setupPanelActions({
      backgroundConnection: connectionToBackground,
      panel: panelRef.current,
      setClientIds,
      tabId: tabIdRef.current,
      setInitPanelComplete,
      initPanel,
      resetStore,
      cleanUpsRef,
    })
  );

  connectionToBackground.onDisconnect.addListener((port) => {
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
  return connectionToBackground;
};

const logMessage = createLogger(`panel-container`);
