import browser from "webextension-polyfill";
import { CustomEventTarget } from "../utils";

export interface IPanelContext {
  tabId: number;
  backgroundConnection: browser.Runtime.Port;
  panel: CustomEventTarget;
  setClientIds: React.Dispatch<React.SetStateAction<string[]>>;
}
