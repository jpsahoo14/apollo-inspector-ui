import browser from "webextension-polyfill";
import { CustomEventTarget } from "../utils";

export interface IDevtoolState {
  isPanelCreated: boolean;
}

export interface IDevtoolContext {
  backgroundConnection: browser.Runtime.Port;
  devtools: CustomEventTarget;
  devtoolState: IDevtoolState;
}
