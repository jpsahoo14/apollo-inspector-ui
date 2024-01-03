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
  generateRequestInfo,
  createLogger,
  sendMessageViaEventTarget,
} from "../utils";
import { IWebpageContext } from "./web-page.interface";
import { ApolloInspector, IDataView } from "apollo-inspector";
import { getApolloClientsObj } from "./web-page-utils";
import { ApolloClient, InMemoryCache } from "@apollo/client";

export const devtoolScriptLoadedAction = (context: IWebpageContext) => {
  const { webpage, tabId } = context;

  return () => {
    const apolloClientIds = getApolloClients();
    if (apolloClientIds) {
      sendMessageViaEventTarget(webpage, {
        destinationName: DEVTOOL,
        action: DEVTOOLS_ACTIONS.CREATE_DEVTOOLS_PANEL,
        tabId,
        callerName: WEB_PAGE,
        data: {
          apolloClientIds,
        },
      });
    }
  };
};

export const getApolloClientsIdsAction = (context: IWebpageContext) => {
  const { tabId, webpage } = context;
  return (receivedMessage: IMessagePayload) => {
    const apolloClientIds = getApolloClients();

    sendMessageViaEventTarget(webpage, {
      destinationName: PANEL_PAGE,
      action: WEBPAGE_ACTIONS.APOLLO_CLIENT_IDS,
      tabId,
      callerName: WEB_PAGE,
      data: { apolloClientsIds: apolloClientIds },
    });
  };
};

export const getCopyWholeCacheCB = (context: IWebpageContext) => {
  const { webpage, tabId } = context;
  return (message: IMessagePayload) => {
    const { clientId } = message.data;
    const ac = getApolloClientByClientId(clientId);
    const data = ac?.cache.data.data;
    sendMessageViaEventTarget(webpage, {
      action: WEBPAGE_ACTIONS.WHOLE_APOLLO_CACHE_DATA,
      callerName: WEB_PAGE,
      destinationName: PANEL_PAGE,
      tabId,
      data,
    });
  };
};

const getApolloClients = (): string[] | null => {
  if (window.__APOLLO_CLIENTS__ && window.__APOLLO_CLIENTS__.length) {
    const values = window.__APOLLO_CLIENTS__.map((ac) => {
      return ac.clientId;
    });
    if (isTestEnabled) {
      return generateRandomClients(values);
    }

    return values;
  }

  if (window.__APOLLO_CLIENT__) {
    const values = ["default"];
    if (isTestEnabled) {
      return generateRandomClients(values);
    }
    return values;
  }

  return [];
};

const getApolloClientByClientId = (
  clientId: string
): ApolloClient<InMemoryCache> | undefined => {
  const values = getApolloClientObjects();

  const ac = values.find((value) => value.clientId === clientId);

  return ac?.client;
};

const getApolloClientObjects = (): {
  clientId: string;
  client: any;
}[] => {
  if (window.__APOLLO_CLIENTS__ && window.__APOLLO_CLIENTS__.length) {
    return window.__APOLLO_CLIENTS__;
  }

  if (window.__APOLLO_CLIENT__) {
    const values = [{ clientId: "default", client: window.__APOLLO_CLIENT__ }];

    return values;
  }

  return [];
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
      ...generateRequestInfo(WEB_PAGE),
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
  const promise = new Promise<number>((resolve) => {
    sendMessageToContentScript(CONTENT_SCRIPT_ACTIONS.GET_TAB_ID);
    const listener = (event: { data: IMessagePayload }) => {
      const message = event.data;
      if (
        message.destination?.name === WEB_PAGE &&
        message.destination.action === CONTENT_SCRIPT_ACTIONS.TAB_ID_VALUE
      ) {
        logMessage(`message received at web-page `, message);
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

export const getClearStoreCB = (context: IWebpageContext) => {
  return (message: IMessagePayload) => {
    const { clientId } = message.data;
    const apolloClient = getApolloClientByClientId(clientId);
    apolloClient?.clearStore();
  };
};

export const getResetStoreCB = (context: IWebpageContext) => {
  return (message: IMessagePayload) => {
    const { clientId } = message.data;
    const apolloClient = getApolloClientByClientId(clientId);
    apolloClient?.resetStore();
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
        sendMessageViaEventTarget(webpage, {
          destinationName: PANEL_PAGE,
          action: WEBPAGE_ACTIONS.APOLLO_INSPECTOR_DATA,
          tabId,
          callerName: WEB_PAGE,
          data,
        });
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

export const getWebpageUnloadReducer = (context: IWebpageContext) => {
  const { webpage, tabId } = context;
  return () => {
    sendMessageViaEventTarget(webpage, {
      action: WEBPAGE_ACTIONS.WEB_PAGE_UNLOAD,
      callerName: WEB_PAGE,
      destinationName: PANEL_PAGE,
      tabId,
    });
    sendMessageViaEventTarget(webpage, {
      action: WEBPAGE_ACTIONS.WEB_PAGE_UNLOAD,
      destinationName: WEB_PAGE,
      tabId,
      callerName: WEB_PAGE,
    });
  };
};

const logMessage = createLogger(`mainThread`);

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function generateRandomClients(values: string[]) {
  const min = 3;
  const number = getRandomArbitrary(min, 11);
  for (let i = min; i < number; i++) {
    values.push(`test-${i}`);
  }

  return values;
}
