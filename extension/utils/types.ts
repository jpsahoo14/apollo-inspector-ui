import browser from "webextension-polyfill";
import { CustomEventTarget } from "./custom-event-target";
import {
  CONTENT_SCRIPT_ACTIONS,
  WEBPAGE_ACTIONS,
  DEVTOOLS_ACTIONS,
  Context,
} from "./constants";

export interface IConnection {
  name: Context;
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
  [DEVTOOLS_ACTIONS.DEVTOOLS_SCRIPT_LOADED]: string;
  [WEBPAGE_ACTIONS.GET_APOLLO_CLIENTS_IDS]: number;
};
