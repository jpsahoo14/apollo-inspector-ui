import browser from "webextension-polyfill";
import {
  CustomEventTarget,
  DEVTOOL,
  DEVTOOLS_ACTIONS,
  IMessagePayload,
  WEBPAGE_ACTIONS,
  WEB_PAGE,
  createLogger,
  sendMessageViaEventTarget,
} from "../utils";
import { IDevtoolContext } from "./devtools.interface";
import { DevtoolsPanels } from "webextension-polyfill/namespaces/devtools_panels";

export const sendMessageToBackgroundScript = ({
  backgroundConnection,
}: {
  backgroundConnection: browser.Runtime.Port;
}) => {
  return (message: IMessagePayload) => {
    logMessage(`sending message to background`, { message });
    backgroundConnection.postMessage(message);
  };
};

export const handleMessageForDevtool = ({
  devtools,
}: {
  devtools: CustomEventTarget;
}) => {
  return (message: IMessagePayload) => {
    const action = message.destination.action;
    const event = new CustomEvent(action, { detail: message });
    devtools.dispatchEvent(event);
  };
};

export const createDevtoolsPanel = (context: IDevtoolContext) => {
  const { devtoolState } = context;
  return async (message: IMessagePayload) => {
    if (devtoolState.isPanelCreated) {
      return;
    }
    const panel: DevtoolsPanels.ExtensionPanel =
      await browser.devtools.panels.create(
        "Apollo Inspector",
        "",
        "panel.html"
      );

    devtoolState.isPanelCreated = true;
    panel.onShown.addListener((panelWindow: Window) => {
      logMessage(`panel shown`, {});
    });

    panel.onHidden.addListener((panelWindow: Window) => {
      logMessage(`panel hidden`, {});
    });
  };
};

export const getContentScriptLoadedMethod = (context: IDevtoolContext) => {
  const { devtoolState, backgroundConnection, devtools, tabId } = context;
  return (message) => {
    devtoolState.cleanUps.forEach((cleanUp) => cleanUp());
    devtoolState.cleanUps = [];
    if (devtoolState.isPanelCreated) {
      return;
    }

    const currentTime = Date.now();
    const fetchUntil = 10000;
    const intervalNumber = setInterval(() => {
      sendMessageViaEventTarget(devtools, {
        action: WEBPAGE_ACTIONS.GET_APOLLO_CLIENTS_IDS,
        callerName: DEVTOOL,
        destinationName: WEB_PAGE,
        tabId: devtoolState.tabId,
        data: {
          cleanUpLength: devtoolState.cleanUps.length,
          startTime: currentTime,
          nowTime: Date.now(),
          result: Date.now() - currentTime > fetchUntil,
        },
      });
    }, 1000);

    const removeListener = devtools.addEventListener(
      WEBPAGE_ACTIONS.APOLLO_CLIENT_IDS,
      (message: IMessagePayload) => {
        if (
          devtoolState.isPanelCreated ||
          Date.now() - currentTime > fetchUntil
        ) {
          removeListener();
          clearInterval(intervalNumber);
          return;
        }

        if (message.data?.apolloClientsIds?.length > 0) {
          removeListener();
          clearInterval(intervalNumber);
          sendMessageViaEventTarget(devtools, {
            action: DEVTOOLS_ACTIONS.CREATE_DEVTOOLS_PANEL,
            callerName: DEVTOOL,
            destinationName: DEVTOOL,
            tabId: devtoolState.tabId,
          });
        }
      }
    );

    const cleanUp = () => {
      removeListener();
      clearInterval(intervalNumber);
    };
    devtoolState.cleanUps.push(cleanUp);
  };
};

export const getHandleWebpageUnload = (context: IDevtoolContext) => {
  const { devtoolState } = context;
  return (message: IMessagePayload) => {
    devtoolState.cleanUps.forEach((cleanUp) => cleanUp());
    devtoolState.cleanUps = [];
  };
};

const logMessage = createLogger(`devtools`);
