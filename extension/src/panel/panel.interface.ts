import React from "react";
import browser from "webextension-polyfill";
import { CustomEventTarget } from "../utils";
import { IVerboseOperation } from "apollo-inspector";

export interface IPanelContext {
  tabId: number;
  backgroundConnection: browser.Runtime.Port;
  panel: CustomEventTarget;
  setClientIds: React.Dispatch<React.SetStateAction<string[] | null>>;
  setInitPanelComplete: React.Dispatch<React.SetStateAction<boolean>>;
  resetStore: () => void;
  initPanel: () => void;
  cleanUpsRef: React.MutableRefObject<(() => void)[]>;
}

export interface IDataViewMap {
  operationsMap: Map<number, IVerboseOperation>;
  verboseOperationsMap: Map<number, IVerboseOperation>;
}
