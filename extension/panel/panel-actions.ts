import copy from "copy-to-clipboard";
import { IMessagePayload, createLogger } from "../utils";
import { IPanelContext } from "./panel.interface";

export const sendMessageFromPanelPage = (context: IPanelContext) => {
  const { backgroundConnection } = context;
  return (message: IMessagePayload) => {
    logMessage(`imp! sending message from panel-action`, message);
    backgroundConnection.postMessage(message);
  };
};

export const getCopyData = (context: IPanelContext) => {
  return (message: IMessagePayload) => {
    const data = message.data;
    const stringifiedData = JSON.stringify(data);
    copy(stringifiedData);
  };
};

export const getHandlePanelPageActions = (context: IPanelContext) => {
  const { panel } = context;
  return (message: IMessagePayload) => {
    const event = new CustomEvent(message.destination.action, {
      detail: message,
    });

    panel.dispatchEvent(event);
  };
};

export const getHandleWebPageUnload = (context: IPanelContext) => {
  const { resetStore, cleanUpsRef } = context;
  return (message: IMessagePayload) => {
    logMessage(`handle webpage unload`, message);
    resetStore();
    cleanUpsRef.current.forEach((cleanUp) => cleanUp());
    cleanUpsRef.current = [];
  };
};

export const contentScriptLoaded = (context: IPanelContext) => {
  const { initPanel, cleanUpsRef } = context;
  return (message: IMessagePayload) => {
    initPanel();
  };
};

const logMessage = createLogger(`panel-action`);
