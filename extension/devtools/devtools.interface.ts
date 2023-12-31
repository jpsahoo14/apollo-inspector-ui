import browser from "webextension-polyfill";
import { CustomEventTarget } from "../utils";
import { DevtoolsPanels } from "webextension-polyfill/namespaces/devtools_panels";

export interface IDevtoolState {
  isPanelCreated: boolean;
  panel: DevtoolsPanels.ExtensionPanel | null;
}

export interface IDevtoolContext {
  backgroundConnection: browser.Runtime.Port;
  devtools: CustomEventTarget;
  devtoolState: IDevtoolState;
}
