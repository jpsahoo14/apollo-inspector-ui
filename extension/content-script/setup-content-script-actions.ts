import browser from "webextension-polyfill";
import {
  DEVTOOL,
  IMessagePayload,
  CONTENT_SCRIPT,
  WEB_PAGE,
  CONTENT_SCRIPT_ACTIONS,
  IContentScriptContext,
  CustomEventTarget,
  PANEL_PAGE,
  WEBPAGE_ACTIONS,
  createLogger,
  sendMessageViaEventTarget,
  BACKGROUND,
} from "../utils";
import {
  getTabId,
  getDevtoolAction,
  getContentScriptAction,
  getWebpageAction,
  getContentScriptUnloadReducer,
} from "./content-script-actions";
import { IContentScriptInitialContext } from "./content-script.interface";

export const setupContentScriptsActions = (context: IContentScriptContext) => {
  const { contentScript, addToCleanUp } = context;
  const cleanUps: (() => void)[] = [];
  const actionToReducers = {
    [DEVTOOL]: getDevtoolAction(context),
    [PANEL_PAGE]: getDevtoolAction(context),
  };

  for (const prop in actionToReducers) {
    const modifiedProp = prop as CONTENT_SCRIPT_ACTIONS;
    const cleanUp = contentScript.addEventListener(
      modifiedProp,
      actionToReducers[modifiedProp]
    );
    addToCleanUp(cleanUp);
    cleanUps.push(cleanUp);
  }

  return () => {
    cleanUps.forEach((cleanUp) => cleanUp());
  };
};

export const setupInitialContentScriptAction = (
  context: IContentScriptInitialContext
) => {
  const { addToCleanUp, contentScript } = context;
  const actionToReducers = {
    [CONTENT_SCRIPT_ACTIONS.GET_TAB_ID]: getTabId(context),
    [WEBPAGE_ACTIONS.WEB_PAGE_INIT_COMPLETE]:
      runContentScriptInitialization(context),
    [CONTENT_SCRIPT]: getContentScriptAction(context),
  };

  for (const prop in actionToReducers) {
    const modifiedProp = prop as CONTENT_SCRIPT_ACTIONS;

    addToCleanUp(
      contentScript.addEventListener(
        modifiedProp,
        actionToReducers[modifiedProp]
      )
    );
  }

  addToCleanUp(
    contentScript.addConnectionListeners((message: IMessagePayload) => {
      logMessage(`sending message to webpage`, { message });
      window.postMessage(message, "*");
    })
  );

  listenToPostMessage(contentScript, addToCleanUp);
};

const runContentScriptInitialization = (
  context: IContentScriptInitialContext
) => {
  const { store, contentScript, addToCleanUp } = context;
  return (message: IMessagePayload) => {
    const { tabId } = store;
    connectToBackgroundServiceWorker(contentScript, context);

    sendMessageViaEventTarget(contentScript, {
      action: CONTENT_SCRIPT_ACTIONS.CONTENT_SCRIPT_INIT_COMPLETE,
      callerName: CONTENT_SCRIPT,
      destinationName: WEB_PAGE,
      tabId: tabId as number,
    });

    sendMessageViaEventTarget(contentScript, {
      action: CONTENT_SCRIPT_ACTIONS.CONTENT_SCRIPT_INIT_COMPLETE,
      callerName: CONTENT_SCRIPT,
      destinationName: PANEL_PAGE,
      tabId: tabId as number,
    });

    sendMessageViaEventTarget(contentScript, {
      action: CONTENT_SCRIPT_ACTIONS.CONTENT_SCRIPT_INIT_COMPLETE,
      callerName: CONTENT_SCRIPT,
      destinationName: DEVTOOL,
      tabId: tabId as number,
    });
  };
};

const listenToPostMessage = (
  contentScript: CustomEventTarget,
  addToCleanUp: (removeListener: () => void) => void
) => {
  const listener = (event: { data: IMessagePayload }) => {
    const message = event.data;
    message.destination?.name &&
      logMessage(`message received at content-script from postmessage`, {
        message,
      });
    const customEvent = new CustomEvent(event.data?.destination?.action, {
      detail: message,
    });
    contentScript.dispatchEvent(customEvent);
  };
  window.addEventListener("message", listener);
  addToCleanUp(() => {
    window.removeEventListener("message", listener);
  });
};

const setupWindowEventListeners = (context: IContentScriptInitialContext) => {
  const {
    store: { cleanUps },
  } = context;
  const beforeUnloadListener = getContentScriptUnloadReducer(context);
  const handler = () => {
    beforeUnloadListener();
    cleanUps.forEach((cleanUp) => cleanUp());
  };
  window.addEventListener("beforeunload", handler);

  return () => {
    window.removeEventListener("beforeunload", handler);
  };
};

const connectToBackgroundServiceWorker = (
  contentScript: CustomEventTarget,
  context: IContentScriptInitialContext
) => {
  const { addToCleanUp, store } = context;
  const { tabId } = store;
  const onDisconnectCleanUps: (() => void)[] = [];
  const connectionToBackgroundService: browser.Runtime.Port =
    browser.runtime.connect({
      name: `${JSON.stringify({ name: CONTENT_SCRIPT, tabId })}`,
    });

  connectionToBackgroundService.onMessage.addListener(
    (message: IMessagePayload) => {
      logMessage(`message received at content-script`, { message });
      const event = new CustomEvent(message.destination.action, {
        detail: message,
      });
      contentScript.dispatchEvent(event);
    }
  );

  onDisconnectCleanUps.push(
    contentScript.addConnectionListeners((message: IMessagePayload) =>
      connectionToBackgroundService.postMessage(message)
    )
  );

  addToCleanUp(() => {
    try {
      connectionToBackgroundService.disconnect();
    } catch {}
  });

  onDisconnectCleanUps.push(setupWindowEventListeners(context));

  onDisconnectCleanUps.push(
    setupContentScriptsActions({
      contentScript,
      backgroundService: connectionToBackgroundService,
      addToCleanUp,
      tabId: tabId as number,
    })
  );

  connectionToBackgroundService.onDisconnect.addListener((port) => {
    logMessage(`content-script disconnected from background`, {
      data: port,
    });
    onDisconnectCleanUps.forEach((cleanUp) => cleanUp());
    connectToBackgroundServiceWorker(contentScript, context);
  });
};

const logMessage = createLogger(`content-script`);
