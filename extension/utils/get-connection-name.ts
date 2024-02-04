import browser from "webextension-polyfill";
import { IConnection } from "./types";
import { Context } from "./constants";

export const getConnectionObject = (
  connection: browser.Runtime.Port
): IConnection => {
  const connectionName = connection.name;

  try {
    const connection: IConnection = JSON.parse(connectionName);

    return connection;
  } catch {
    return { name: Context.Unknown, tabId: 0 };
  }
};
