import { IMessagePayload, createLogger } from "../utils";
import { IPanelContext } from "./panel.interface";

export const getSetApolloClientIds = (context: IPanelContext) => {
  const { setClientIds } = context;
  return (message: IMessagePayload) => {
    const apolloClientsIds = message.data.apolloClientsIds;

    setClientIds(apolloClientsIds);
  };
};

export const sendMessageFromPanelPage = (context: IPanelContext) => {
  const { backgroundConnection } = context;
  return (message: IMessagePayload) => {
    logMessage(`sending message from panel-action`, message);
    backgroundConnection.postMessage(message);
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
  const { resetStore } = context;
  return (message: IMessagePayload) => {
    logMessage(`handle webpage unload`, message);
    resetStore();
  };
};

export const contentScriptLoaded = (context: IPanelContext) => {
  const { initPanel } = context;
  return (message: IMessagePayload) => {
    initPanel();
  };
};

const logMessage = createLogger(`panel-action`);
