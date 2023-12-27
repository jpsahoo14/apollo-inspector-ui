import {
  isTestEnabled,
  IMessagePayload,
  DEVTOOL,
  DEVTOOLS_ACTIONS,
  CONTENT_SCRIPT_ACTIONS,
  CONTENT_SCRIPT,
  WEB_PAGE,
  WEBPAGE_ACTIONS,
  PANEL_PAGE,
  PANEL_PAGE_ACTIONS,
  generateRequestId,
} from "../utils";
import { IWebpageContext } from "./web-page.interface";
import { ApolloInspector, IDataView } from "apollo-inspector";
import { getApolloClientsObj } from "./web-page-utils";

export const devtoolScriptLoadedAction = (context: IWebpageContext) => {
  const { webpage, tabId } = context;

  return () => {
    const apolloClientIds = getApolloClients();
    if (apolloClientIds) {
      const message: IMessagePayload = {
        destination: {
          name: DEVTOOL,
          action: DEVTOOLS_ACTIONS.CREATE_DEVTOOLS_PANEL,
          tabId,
        },
        data: {
          apolloClientIds,
        },
        requestInfo: {
          requestId: `${WEB_PAGE}:${Date.now()}`,
        },
      };
      const event = new CustomEvent(DEVTOOL, { detail: message });
      webpage.dispatchEvent(event);
    }
  };
};

export const getApolloClientsIdsAction = (context: IWebpageContext) => {
  const { tabId, webpage } = context;
  return (receivedMessage: IMessagePayload) => {
    const apolloClientIds = getApolloClients();

    const message: IMessagePayload = {
      destination: {
        name: PANEL_PAGE,
        action: PANEL_PAGE_ACTIONS.SET_APOLLO_CLIENT_IDS,
        tabId,
      },
      requestInfo: {
        requestId: generateRequestId(WEB_PAGE),
      },
      data: { apolloClientsIds: apolloClientIds },
    };

    const event = new CustomEvent(message.destination.name, {
      detail: message,
    });
    webpage.dispatchEvent(event);
  };
};

const getApolloClients = (): string[] | null => {
  if (window.__APOLLO_CLIENTS__ && window.__APOLLO_CLIENTS__.length) {
    return window.__APOLLO_CLIENTS__.map((ac) => {
      return ac.clientId;
    });
  }

  if (window.__APOLLO_CLIENT__) {
    return ["default"];
  }

  if (isTestEnabled) {
    return ["default"];
  }

  return null;
};

const sendMessageToContentScript = (
  action: CONTENT_SCRIPT_ACTIONS,
  data?: any
) => {
  const message: IMessagePayload = {
    destination: {
      action,
      name: CONTENT_SCRIPT,
      tabId: 0,
    },
    requestInfo: {
      requestId: `${WEB_PAGE}:${Date.now()}`,
    },
  };
  logMessage(`sending message from webpage`, message);
  window.postMessage(message, "*");
};

export const sendMessage = (message: IMessagePayload) => {
  logMessage(`message being sent from webpage`, message);
  window.postMessage(message, "*");
};

export const getTabId = (): Promise<number> => {
  const promise = new Promise<number>((resolve, reject) => {
    sendMessageToContentScript(CONTENT_SCRIPT_ACTIONS.GET_TAB_ID);
    const listener = (event: { data: IMessagePayload }) => {
      const message = event.data;
      if (
        message.destination?.name === WEB_PAGE &&
        message.destination.action === WEBPAGE_ACTIONS.TAB_ID_VALUE
      ) {
        window.removeEventListener("message", listener);

        resolve(message.destination?.tabId);
      }
    };
    window.addEventListener("message", listener);
  });

  return promise;
};

export const getHandleWebpageAction = (context: IWebpageContext) => {
  const { webpage } = context;
  return (message: IMessagePayload) => {
    const event = new CustomEvent(message.destination.action, {
      detail: message,
    });
    webpage.dispatchEvent(event);
  };
};

export const getStartRecordingAction = (context: IWebpageContext) => {
  const { webpageStore, webpage, tabId } = context;
  return (message: IMessagePayload) => {
    webpageStore.apolloInspectorSubscription?.unsubscribe();
    const result = getApolloClientsObj();
    const apolloInspector = new ApolloInspector(result);

    const observable = apolloInspector.startTrackingSubscription({
      apolloClientIds: message.data.apolloClientIds,
      delayOperationsEmitByInMS: 1000,
      tracking: { trackVerboseOperations: true },
    });

    const subscription = observable.subscribe({
      next: (data: IDataView) => {
        const message: IMessagePayload = {
          destination: {
            name: PANEL_PAGE,
            action: PANEL_PAGE_ACTIONS.APOLLO_INSPECTOR_DATA,
            tabId,
          },
          requestInfo: {
            requestId: generateRequestId(WEB_PAGE),
          },
          data,
        };

        const event = new CustomEvent(message.destination.name, {
          detail: message,
        });
        webpage.dispatchEvent(event);
      },
      error: () => {},
      complete: () => {},
    });

    webpageStore.apolloInspectorSubscription = subscription;
  };
};

export const getStopRecordingReducer = (context: IWebpageContext) => {
  const { webpageStore } = context;

  return (message: IMessagePayload) => {
    webpageStore.apolloInspectorSubscription?.unsubscribe();
    webpageStore.apolloInspectorSubscription = null;
  };
};

function logMessage(message: string, data: any) {
  console.log(`[mainThread]AIE ${message}`, data);
}
