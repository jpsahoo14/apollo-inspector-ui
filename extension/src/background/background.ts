import browser from "webextension-polyfill";
import {
  CustomEventTarget,
  IMessagePayload,
  getConnectionObject,
  getForwardingPort,
  DEVTOOLS_ACTIONS,
  BACKGROUND_ACTIONS,
  createLogger,
  sendMessageViaEventTarget,
  Context,
  getLastSender,
  IConnection,
} from "../utils";
import { setupBackgroundActions } from "./setup-background-actions";
import { IBackgroundContext } from "./background.interface";

const backgroundToConnectionsMap: {
  [key: string]: browser.Runtime.Port | undefined;
} = {};

browser.runtime.onMessage.addListener(
  (event, sender: browser.Runtime.MessageSender) => {
    return Promise.resolve(sender.tab?.id);
  }
);

const backgroundEventTarget = new CustomEventTarget(Context.BACKGROUND);

const backgroundContext: IBackgroundContext = {
  backgroundEventTarget,
};

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

  const cleanUpConnectionListener = addConnectionListener(port);

  addPortOnDisconnectListener(port, connection, cleanUpConnectionListener);
});

const addPortOnDisconnectListener = (
  port: browser.Runtime.Port,
  connection: IConnection,
  cleanUpConnectionListener: () => void
) => {
  port.onDisconnect.addListener(() => {
    logMessage(
      `disconnecting from background ${connection.name}-${connection.tabId}`,
      { data: { connection } }
    );
    cleanUpConnectionListener();
    if (connection.name === Context.DEVTOOL) {
      sendMessageViaEventTarget(backgroundEventTarget, {
        action: DEVTOOLS_ACTIONS.DISCONNECTED,
        callerName: Context.BACKGROUND,
        destinationName: Context.WEB_PAGE,
        tabId: connection.tabId,
      });
    }
    delete backgroundToConnectionsMap[JSON.stringify(connection)];
  });
};

const addConnectionListener = (port: browser.Runtime.Port) =>
  backgroundEventTarget.addConnectionListeners((message: IMessagePayload) => {
    const connectionPort = getConnectionObject(port);
    if (
      getLastSender(message.requestInfo.path) !== connectionPort.name &&
      connectionPort.tabId === message.destination.tabId
    ) {
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
      port.postMessage(message);
    }
  });

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
      callerName: Context.BACKGROUND,
      data: message,
    });
  }
};

const logMessage = createLogger(Context.BACKGROUND);

setupBackgroundActions(backgroundContext);
