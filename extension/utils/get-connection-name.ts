import browser from "webextension-polyfill";
import { IConnection } from "./types";

export const getConnectionObject = (
  connection: browser.Runtime.Port
): IConnection => {
  const connectionName = connection.name;

  try {
    const connection: IConnection = JSON.parse(connectionName);

    return connection;
  } catch {
    return { name: "unknown", tabId: 0 };
  }
};
