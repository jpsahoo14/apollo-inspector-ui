import browser from "webextension-polyfill";
import {
  CustomEventTarget,
  IMessagePayload,
  DEVTOOL,
  WEB_PAGE,
  DEVTOOLS_ACTIONS,
  createLogger,
  sendMessageViaEventTarget,
} from "../utils";
import { setupDevtoolActions } from "./setup-devtools-actions";
import { IDevtoolState } from "./devtools.interface";

const tabId = browser.devtools.inspectedWindow.tabId;
const devtoolState: IDevtoolState = {
  isPanelCreated: false,
  panel: null,
  tabId,
  cleanUps: [],
};

const devtoolsEventTarget = new CustomEventTarget("devtools");

const backgroundConnection: browser.Runtime.Port = browser.runtime.connect({
  name: JSON.stringify({ name: DEVTOOL, tabId }),
});

backgroundConnection.onMessage.addListener((message: IMessagePayload) => {
  logMessage(`imp! received message in devtools onMessage`, message);
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
  sendMessageViaEventTarget(devtoolsEventTarget, {
    destinationName: WEB_PAGE,
    action: DEVTOOLS_ACTIONS.DEVTOOLS_SCRIPT_LOADED,
    tabId,
    callerName: DEVTOOL,
  });
}

sendDevtoolsScripLoadedEvent();

const logMessage = createLogger(`devtools`);
