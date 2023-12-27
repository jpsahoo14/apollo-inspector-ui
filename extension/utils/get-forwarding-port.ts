import browser from "webextension-polyfill";
import { IMessagePayload } from "./custom-event-target";
import { IConnection } from "./types";
import {
  BACKGROUND,
  CONTENT_SCRIPT,
  DEVTOOL,
  PANEL_PAGE,
  WEB_PAGE,
} from "./constants";

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
    case BACKGROUND: {
      return { name: BACKGROUND, tabId };
    }

    case CONTENT_SCRIPT:
    case WEB_PAGE: {
      return { name: CONTENT_SCRIPT, tabId };
    }

    case DEVTOOL: {
      return { name: DEVTOOL, tabId };
    }

    case PANEL_PAGE: {
      return { name: PANEL_PAGE, tabId };
    }
  }

  return { name: WEB_PAGE, tabId };
};
