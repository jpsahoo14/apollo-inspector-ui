import browser from "webextension-polyfill";
import {
  IMessagePayload,
  IContentScriptContext,
  CONTENT_SCRIPT_ACTIONS,
  createLogger,
  sendMessageViaEventTarget,
  Context,
} from "../utils";
import { IContentScriptInitialContext } from "./content-script.interface";

export const getTabId = (context: IContentScriptInitialContext) => {
  const { contentScript, store } = context;
  return async () => {
    const getTabId = async (): Promise<number> => {
      const tabId: number = await browser.runtime.sendMessage({
        type: "GET_TAB_ID",
      });
      return tabId;
    };

    const tabId = await getTabId();
    store.tabId = tabId;

    sendMessageViaEventTarget(contentScript, {
      destinationName: Context.WEB_PAGE,
      action: CONTENT_SCRIPT_ACTIONS.TAB_ID_VALUE,
      tabId,
      callerName: Context.CONTENT_SCRIPT,
    });
  };
};

const logMessage = createLogger(`content-script-actions`);

export const getDevtoolAction = ({
  backgroundService,
}: IContentScriptContext) => {
  return (message: IMessagePayload) => {
    logMessage(` sending event to devtool `, { message });

    backgroundService.postMessage(message);
  };
};

export const getContentScriptAction = (
  context: IContentScriptInitialContext
) => {
  const { contentScript } = context;
  return (message: IMessagePayload) => {
    const event = new CustomEvent(message.destination.action, {
      detail: message,
    });
    contentScript.dispatchEvent(event);
  };
};

export const getWebpageAction = (context: IContentScriptInitialContext) => {
  return (message: IMessagePayload) => {
    logMessage(`sending message to webpage`, { message });
    window.postMessage(message, "*");
  };
};

export const getContentScriptUnloadReducer = (
  context: IContentScriptInitialContext
) => {
  const { contentScript, store } = context;
  const { tabId } = store;
  return () => {
    sendMessageViaEventTarget(contentScript, {
      action: CONTENT_SCRIPT_ACTIONS.CONTENT_SCRIPT_UNLOAD,
      callerName: Context.CONTENT_SCRIPT,
      destinationName: Context.PANEL_PAGE,
      tabId: tabId || 1,
    });
  };
};
