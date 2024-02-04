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
  const connection = getConnectionObject(port);
  logMessage(`new connection ${connection.name}-${connection.tabId}`, {
    data: { name: port.name },
  });

  port.onMessage.addListener((message: IMessagePayload) => {
    logMessage(`message received at background `, { message });
    const event = new CustomEvent(message.destination.action, {
      detail: message,
    });
    backgroundEventTarget.dispatchEvent(event);
  });

  backgroundToConnectionsMap[JSON.stringify(connection)] = port;
  const cleanUpConnectionListener =
    backgroundEventTarget.addConnectionListeners((message: IMessagePayload) =>
      port.postMessage(message)
    );

  port.onDisconnect.addListener(() => {
    logMessage(
      `disconnecting from background ${connection.name}-${connection.tabId}`,
      { data: { connection } }
    );
    cleanUpConnectionListener();
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
    [BACKGROUND]: dispatchEventEventWithinBackgroundService,
  };

  for (const prop in actionsToReducers) {
    backgroundEventTarget.addEventListener(prop, actionsToReducers[prop]);
  }
}

const sendMessageToOtherConnection = (message: IMessagePayload) => {
  const port = getForwardingPort(message, backgroundToConnectionsMap);
  logMessage(`sending message `, {
    message,
    data: {
      port,
      backgroundToConnectionsMap,
      name: message.destination.name,
    },
    log: {
      backgroundToConnections: Object.keys(backgroundToConnectionsMap),
      portName: port?.name,
    },
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
  logMessage(`sending message to TO_BACKGROUND`, { message });

  const event = new CustomEvent(message.destination.action, {
    detail: message,
  });
  backgroundEventTarget.dispatchEvent(event);
};

const logMessage = createLogger(BACKGROUND);

setupConnectionListeners();
