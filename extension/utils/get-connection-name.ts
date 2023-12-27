import browser from "webextension-polyfill";
import { IConnection } from "./types";
import { DEVTOOL } from "./constants";

export const getConnectionObject = (
  connection: browser.Runtime.Port
): IConnection => {
  const connectionName = connection.name;

  try {
    const connection: IConnection = JSON.parse(connectionName);

    /* switch (connection.name) {
      case CLIENT: {
        return { ...connection, name: TO_CLIENT };
      }

      case DEVTOOL: {
        return { ...connection, name: TO_DEVTOOL };
      }

      case BACKGROUND: {
        return { ...connection, name: TO_BACKGROUND };
      }
    } */
    return connection;
  } catch {
    return { name: "unknown", tabId: 0 };
  }
};
