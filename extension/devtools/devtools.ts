import browser from "webextension-polyfill";
import {
  CustomEventTarget,
  IMessagePayload,
  DEVTOOL,
  WEBPAGE_ACTIONS,
  WEB_PAGE,
} from "../utils";
import { setupDevtoolActions } from "./setup-devtools-actions";
import { IDevtoolState } from "./devtools.interface";

const devtoolState: IDevtoolState = {
  isPanelCreated: false,
};
const tabId = browser.devtools.inspectedWindow.tabId;

const devtoolsEventTarget = new CustomEventTarget("devtools");

const backgroundConnection: browser.Runtime.Port = browser.runtime.connect({
  name: JSON.stringify({ name: DEVTOOL, tabId }),
});

backgroundConnection.onMessage.addListener((message: IMessagePayload) => {
  logMessage(`received message in devtools onMessage`, message);
  const event = new CustomEvent(message.destination.name, {
    detail: message,
  });
  devtoolsEventTarget.dispatchEvent(event);
});

setupDevtoolActions({
  backgroundConnection,
  devtools: devtoolsEventTarget,
  devtoolState,
});

function sendDevtoolsScripLoadedEvent() {
  const message: IMessagePayload = {
    destination: {
      name: WEB_PAGE,
      action: WEBPAGE_ACTIONS.DEVTOOLS_SCRIPT_LOADED,
      tabId,
    },
    requestInfo: {
      requestId: `${DEVTOOL}:${Date.now()}`,
    },
  };
  const event = new CustomEvent(WEB_PAGE, { detail: message });
  devtoolsEventTarget.dispatchEvent(event);
}

sendDevtoolsScripLoadedEvent();

function logMessage(message: string, data: any) {
  console.log(`[devtools]AIE ${message}`, { data });
}
