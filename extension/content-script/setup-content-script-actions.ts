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
  DEVTOOLS_ACTIONS,
  WEBPAGE_ACTIONS,
  createLogger,
  sendMessageViaEventTarget,
} from "../utils";
import {
  getTabId,
  getDevtoolAction,
  getContentScriptAction,
  getWebpageAction,
} from "./content-script-actions";
import { IContentScriptInitialContext } from "./content-script.interface";

export const setupContentScriptsActions = (context: IContentScriptContext) => {
  const { contentScript, addToCleanUp } = context;

  const actionToReducers = {
    [DEVTOOL]: getDevtoolAction(context),
    [PANEL_PAGE]: getDevtoolAction(context),
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
};

export const setupInitialContentScriptAction = (
  context: IContentScriptInitialContext
) => {
  const { addToCleanUp, contentScript } = context;
  const actionToReducers = {
    [CONTENT_SCRIPT_ACTIONS.GET_TAB_ID]: getTabId(context),
    [WEBPAGE_ACTIONS.WEB_PAGE_INIT_COMPLETE]:
      runContentScriptInitialization(context),
    [WEB_PAGE]: getWebpageAction(context),
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

  listenToPostMessage(contentScript, addToCleanUp);
};

const runContentScriptInitialization = (
  context: IContentScriptInitialContext
) => {
  const { store, contentScript, addToCleanUp } = context;
  return (message: IMessagePayload) => {
    const { tabId, cleanUps } = store;
    const connectionToBackgroundService: browser.Runtime.Port =
      browser.runtime.connect({
        name: `${JSON.stringify({ name: CONTENT_SCRIPT, tabId })}`,
      });

    connectionToBackgroundService.onMessage.addListener(
      (message: IMessagePayload) => {
        logMessage(`message received at content-script`, message);
        const event = new CustomEvent(message.destination.name, {
          detail: message,
        });
        contentScript.dispatchEvent(event);
      }
    );

    setupContentScriptsActions({
      contentScript,
      backgroundService: connectionToBackgroundService,
      addToCleanUp,
      tabId: tabId as number,
    });

    connectionToBackgroundService.onDisconnect.addListener((port) => {
      cleanUps.forEach((cleanUp) => cleanUp());
    });

    sendMessageViaEventTarget(contentScript, {
      action: CONTENT_SCRIPT_ACTIONS.CONTENT_SCRIPT_INIT_COMPLETE,
      callerName: CONTENT_SCRIPT,
      destinationName: WEB_PAGE,
      tabId: tabId as number,
    });

    sendMessageViaEventTarget(contentScript, {
      action: CONTENT_SCRIPT_ACTIONS.CONTENT_SCRIPT_INIT_COMPLETE,
      destinationName: PANEL_PAGE,
      tabId: tabId as number,
      callerName: CONTENT_SCRIPT,
    });
  };
};

function listenToPostMessage(
  contentScript: CustomEventTarget,
  addToCleanUp: (removeListener: () => void) => void
) {
  const listener = (event: { data: IMessagePayload }) => {
    const message = event.data;
    message.destination?.name &&
      logMessage(
        `message received at content-script from postmessage`,
        message
      );
    const customEvent = new CustomEvent(event.data?.destination?.name, {
      detail: message,
    });
    contentScript.dispatchEvent(customEvent);
  };
  window.addEventListener("message", listener);
  addToCleanUp(() => {
    window.removeEventListener("message", listener);
  });
}

const logMessage = createLogger(`content-script`);
