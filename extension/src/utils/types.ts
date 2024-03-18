import browser from "webextension-polyfill";
import { CustomEventTarget } from "./custom-event-target";
import {
  CONTENT_SCRIPT_ACTIONS,
  WEBPAGE_ACTIONS,
  DEVTOOLS_ACTIONS,
  Context,
} from "./constants";
import { DocumentNode, VariableDefinitionNode } from "graphql";

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

export type IWatchQueryInfo = {
  document: DocumentNode;
  variables?: VariableDefinitionNode;
  data?: QueryData;
};

export type QueryData = JSONObject;

export type JSONPrimitive = string | number | null | boolean;
export type JSONObject = { [key: string]: JSONValue };
export type JSONValue = JSONPrimitive | JSONValue[] | JSONObject;
