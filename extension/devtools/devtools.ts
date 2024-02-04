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

const connectToBackgroundServiceWorker = () => {
  const onDisconnectCleanUps: (() => void)[] = [];

  const backgroundConnection: browser.Runtime.Port = browser.runtime.connect({
    name: JSON.stringify({ name: DEVTOOL, tabId }),
  });

  backgroundConnection.onMessage.addListener((message: IMessagePayload) => {
    logMessage(`received message in devtools onMessage`, { message });
    const event = new CustomEvent(message.destination.action, {
      detail: message,
    });
    devtoolsEventTarget.dispatchEvent(event);
  });

  onDisconnectCleanUps.push(
    devtoolsEventTarget.addConnectionListeners((message: IMessagePayload) =>
      backgroundConnection.postMessage(message)
    )
  );
  onDisconnectCleanUps.push(
    setupDevtoolActions({
      backgroundConnection,
      devtools: devtoolsEventTarget,
      devtoolState,
    })
  );

  backgroundConnection.onDisconnect.addListener((port) => {
    logMessage(`devtool disconnected from background`, {
      data: port,
    });
    onDisconnectCleanUps.forEach((cleanUp) => cleanUp());
    connectToBackgroundServiceWorker();
  });
};

connectToBackgroundServiceWorker();

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
