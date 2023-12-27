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
const cleanUps = [];
const addToCleanup = (cleanUp: () => void) => {
  cleanUps.push(cleanUp);
};

setupConnectionListeners();

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
    delete backgroundToConnectionsMap[JSON.stringify(connection)];
  });
});

function setupConnectionListeners() {
  addToCleanup(
    backgroundEventTarget.addEventListener(
      CONTENT_SCRIPT,
      (message: IMessagePayload) => {
        const port = getForwardingPort(message, backgroundToConnectionsMap);
        logMessage(`sending message to client`, {
          message,
          port,
          backgroundToConnectionsMap,
        });
        port && port.postMessage(message);
      }
    )
  );

  addToCleanup(
    backgroundEventTarget.addEventListener(
      WEB_PAGE,
      (message: IMessagePayload) => {
        const port = getForwardingPort(message, backgroundToConnectionsMap);

        logMessage(`sending message to web-page`, {
          message,
          port,
          backgroundToConnectionsMap,
        });
        port && port.postMessage(message);
      }
    )
  );

  addToCleanup(
    backgroundEventTarget.addEventListener(
      BACKGROUND,
      (message: IMessagePayload) => {
        logMessage(`sending message to TO_BACKGROUND`, message);

        const event = new CustomEvent(message.destination.action, {
          detail: message,
        });
        backgroundEventTarget.dispatchEvent(event);
      }
    )
  );

  addToCleanup(
    backgroundEventTarget.addEventListener(
      DEVTOOL,
      (message: IMessagePayload) => {
        const port = getForwardingPort(message, backgroundToConnectionsMap);

        logMessage(`sending message to TO_DEVTOOL`, {
          message,
          port,
          backgroundToConnectionsMap,
        });
        port && port.postMessage(message);
      }
    )
  );

  addToCleanup(
    backgroundEventTarget.addEventListener(
      PANEL_PAGE,
      (message: IMessagePayload) => {
        const port = getForwardingPort(message, backgroundToConnectionsMap);

        logMessage(`sending message to PANEL_PAGE`, {
          message,
          port,
          backgroundToConnectionsMap,
        });
        port && port.postMessage(message);
      }
    )
  );
}

function logMessage(message: string, data: any) {
  console.log(`[background]AIE ${message}`, { data });
}
