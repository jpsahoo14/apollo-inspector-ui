import browser from "webextension-polyfill";
import { CustomEventTarget, IMessagePayload } from "./custom-event-target";
import { CONTENT_SCRIPT_ACTIONS } from "./constants";

export interface IConnection {
  name: string;
  tabId: number;
}

export interface IContentScriptContext {
  contentScript: CustomEventTarget;
  backgroundService: browser.Runtime.Port;
  addToCleanUp: (removeListener: () => void) => void;
  tabId: number;
}

export type IPayloadFromActions = {
  [CONTENT_SCRIPT_ACTIONS.GET_TAB_ID]: undefined;
  [CONTENT_SCRIPT_ACTIONS.DEVTOOLS_SCRIPT_LOADED]: string;
  [CONTENT_SCRIPT_ACTIONS.GET_APOLLO_CLIENTS_IDS]: number;
};
