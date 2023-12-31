import browser from "webextension-polyfill";
import {
  CustomEventTarget,
  BACKGROUND,
  DEVTOOL,
  IMessagePayload,
  getConnectionObject,
  WEB_PAGE,
  CONTENT_SCRIPT,
  getForwardingPort,
  PANEL_PAGE,
  DEVTOOLS_ACTIONS,
  BACKGROUND_ACTIONS,
  createLogger,
  sendMessageViaEventTarget,
} from "../utils";
const backgroundToConnectionsMap: {
  [key: string]: browser.Runtime.Port | undefined;
} = {};

browser.runtime.onMessage.addListener(
  (event, sender: browser.Runtime.MessageSender) => {
    return Promise.resolve(sender.tab?.id);
  }
);

const backgroundEventTarget = new CustomEventTarget("background");
const cleanUps: (() => void)[] = [];
const addToCleanup = (cleanUp: () => void) => {
  cleanUps.push(cleanUp);
};

browser.runtime.onConnect.addListener((port: browser.Runtime.Port) => {
  logMessage(`new connection `, { name: port.name });
  const connection = getConnectionObject(port);

  port.onMessage.addListener((message: IMessagePayload) => {
    logMessage(`message received at background`, message);
    const event = new CustomEvent(message.destination.name, {
      detail: message,
    });
    backgroundEventTarget.dispatchEvent(event);
  });

  backgroundToConnectionsMap[JSON.stringify(connection)] = port;

  port.onDisconnect.addListener(() => {
    logMessage(`disconnecting from background`, connection);
    if (connection.name === DEVTOOL) {
      sendMessageViaEventTarget(backgroundEventTarget, {
        action: DEVTOOLS_ACTIONS.DISCONNECTED,
        callerName: BACKGROUND,
        destinationName: WEB_PAGE,
        tabId: connection.tabId,
      });
    }
    delete backgroundToConnectionsMap[JSON.stringify(connection)];
  });
});

function setupConnectionListeners() {
  const actionsToReducers = {
    [CONTENT_SCRIPT]: sendMessageToOtherConnection,
    [WEB_PAGE]: sendMessageToOtherConnection,
    [DEVTOOL]: sendMessageToOtherConnection,
    [PANEL_PAGE]: sendMessageToOtherConnection,
    [BACKGROUND]: dispatchEventEventWithinBackgroundService,
  };

  for (const prop in actionsToReducers) {
    backgroundEventTarget.addEventListener(prop, actionsToReducers[prop]);
  }
}

const sendMessageToOtherConnection = (message: IMessagePayload) => {
  const port = getForwardingPort(message, backgroundToConnectionsMap);
  logMessage(`sending message to ${message.destination.name}`, {
    message,
    port,
    backgroundToConnectionsMap,
    name: message.destination.name,
  });
  if (port) {
    port.postMessage(message);
  } else {
    sendMessageViaEventTarget(backgroundEventTarget, {
      destinationName: message.requestInfo.sender,
      action: BACKGROUND_ACTIONS.PORT_NOT_FOUND,
      tabId: message.destination.tabId,
      callerName: BACKGROUND,
      data: message,
    });
  }
};

const dispatchEventEventWithinBackgroundService = (
  message: IMessagePayload
) => {
  logMessage(`sending message to TO_BACKGROUND`, message);

  const event = new CustomEvent(message.destination.action, {
    detail: message,
  });
  backgroundEventTarget.dispatchEvent(event);
};

const logMessage = createLogger(BACKGROUND);

setupConnectionListeners();
