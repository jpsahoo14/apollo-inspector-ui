import browser from "webextension-polyfill";
import {
  CustomEventTarget,
  IMessagePayload,
  DEVTOOLS_ACTIONS,
  createLogger,
  sendMessageViaEventTarget,
  Context,
  getLastSender,
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

const devtoolsEventTarget = new CustomEventTarget(Context.DEVTOOL);

const connectToBackgroundServiceWorker = () => {
  const onDisconnectCleanUps: (() => void)[] = [];

  const backgroundConnection: browser.Runtime.Port = browser.runtime.connect({
    name: JSON.stringify({ name: Context.DEVTOOL, tabId }),
  });

  backgroundConnection.onMessage.addListener((message: IMessagePayload) => {
    logMessage(`received message in devtools onMessage`, { message });
    const event = new CustomEvent(message.destination.action, {
      detail: message,
    });
    devtoolsEventTarget.dispatchEvent(event);
  });

  onDisconnectCleanUps.push(
    devtoolsEventTarget.addConnectionListeners((message: IMessagePayload) => {
      if (getLastSender(message.requestInfo.path) !== Context.BACKGROUND) {
        backgroundConnection.postMessage(message);
      }
    })
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
    destinationName: Context.WEB_PAGE,
    action: DEVTOOLS_ACTIONS.DEVTOOLS_SCRIPT_LOADED,
    tabId,
    callerName: Context.DEVTOOL,
  });
}

sendDevtoolsScripLoadedEvent();

const logMessage = createLogger(`devtools`);
