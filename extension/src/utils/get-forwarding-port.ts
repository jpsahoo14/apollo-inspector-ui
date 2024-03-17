import browser from "webextension-polyfill";
import { IMessagePayload } from "./custom-event-target";
import { IConnection } from "./types";
import { Context } from "./constants";

export const getForwardingPort = (
  message: IMessagePayload,
  backgroundToConnectionsMap: {
    [key: string]: browser.Runtime.Port | undefined;
  }
) => {
  const connectionObject = getConectionObject(message);
  const port = backgroundToConnectionsMap[JSON.stringify(connectionObject)];

  return port;
};

const getConectionObject = (message: IMessagePayload): IConnection => {
  const tabId = message.destination.tabId;
  switch (message.destination.name) {
    case Context.BACKGROUND: {
      return { name: Context.BACKGROUND, tabId };
    }

    case Context.CONTENT_SCRIPT:
    case Context.WEB_PAGE: {
      return { name: Context.CONTENT_SCRIPT, tabId };
    }

    case Context.DEVTOOL: {
      return { name: Context.DEVTOOL, tabId };
    }

    case Context.PANEL_PAGE: {
      return { name: Context.PANEL_PAGE, tabId };
    }
  }

  return { name: Context.WEB_PAGE, tabId };
};
