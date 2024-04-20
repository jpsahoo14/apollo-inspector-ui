import {
  isTestEnabled,
  IMessagePayload,
  DEVTOOLS_ACTIONS,
  CONTENT_SCRIPT_ACTIONS,
  WEBPAGE_ACTIONS,
  generateRequestInfo,
  createLogger,
  sendMessageViaEventTarget,
  Context,
  getLastSender,
  getPrivateAccess,
  IWatchQueryInfo,
} from "../utils";
import type { Cache } from "@apollo/client/cache";
import { IWebpageContext } from "./web-page.interface";
import { ApolloInspector, IDataView } from "apollo-inspector";
import { getApolloClientsObj } from "./web-page-utils";
import { ApolloClient, InMemoryCache, ObservableQuery } from "@apollo/client";
import { DocumentNode, VariableDefinitionNode } from "graphql";

export const devtoolScriptLoadedAction = (context: IWebpageContext) => {
  const { webpage, tabId } = context;

  return () => {
    const apolloClientIds = getApolloClients();
    if (apolloClientIds.length > 0) {
      sendMessageViaEventTarget(webpage, {
        destinationName: Context.DEVTOOL,
        action: DEVTOOLS_ACTIONS.CREATE_DEVTOOLS_PANEL,
        tabId,
        callerName: Context.WEB_PAGE,
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
      destinationName: Context.PANEL_PAGE,
      action: WEBPAGE_ACTIONS.APOLLO_CLIENT_IDS,
      tabId,
      callerName: Context.WEB_PAGE,
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
      callerName: Context.WEB_PAGE,
      destinationName: Context.PANEL_PAGE,
      tabId,
      data,
    });
  };
};

export const getActiveWatchQueriesForAClient = (context: IWebpageContext) => {
  const { webpage, tabId } = context;

  return (message: IMessagePayload) => {
    const { clientId } = message.data;
    const apolloClient = getApolloClientByClientId(clientId) as any;

    const activeQueries = getActiveQueries(apolloClient);

    sendMessageViaEventTarget(webpage, {
      action: WEBPAGE_ACTIONS.ACTIVE_WATCH_QUERIES_DATA,
      callerName: Context.WEB_PAGE,
      tabId,
      data: activeQueries,
    });
  };
};

const getApolloClients = (): string[] => {
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
      name: Context.CONTENT_SCRIPT,
      tabId: 0,
    },
    requestInfo: {
      ...generateRequestInfo(Context.WEB_PAGE, action),
    },
  };
  logMessage(`sending message from webpage`, { message });
  window.postMessage(message, "*");
};

export const sendMessage = (message: IMessagePayload) => {
  logMessage(`message being sent from webpage`, { message });
  if (getLastSender(message.requestInfo.path) !== Context.CONTENT_SCRIPT) {
    window.postMessage(message, "*");
  }
};

export const getTabId = (): Promise<number> => {
  const promise = new Promise<number>((resolve) => {
    sendMessageToContentScript(CONTENT_SCRIPT_ACTIONS.GET_TAB_ID);
    const listener = (event: { data: IMessagePayload }) => {
      const message = event.data;
      if (
        message.destination?.name === Context.WEB_PAGE &&
        message.destination.action === CONTENT_SCRIPT_ACTIONS.TAB_ID_VALUE
      ) {
        logMessage(`message received at web-page `, { message });
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
        if (
          data.operations?.length !== 0 ||
          data.verboseOperations?.length !== 0
        ) {
          sendMessageViaEventTarget(webpage, {
            destinationName: Context.PANEL_PAGE,
            action: WEBPAGE_ACTIONS.APOLLO_INSPECTOR_DATA,
            tabId,
            callerName: Context.WEB_PAGE,
            data,
          });
        }
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
      callerName: Context.WEB_PAGE,
      destinationName: Context.PANEL_PAGE,
      tabId,
    });
  };
};

const logMessage = createLogger(`mainThread`);

const getActiveQueries = (apolloClient: any) => {
  if (apolloClient?.queryManager?.getObservableQueries) {
    const observableQueries = apolloClient.queryManager.getObservableQueries();
    return getQueriesFromObservableQueries(observableQueries);
  } else {
    const queries = apolloClient?.queryManager["queries"];
    return getQueries(queries);
  }
};

const getRandomArbitrary = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const generateRandomClients = (values: string[]) => {
  const min = 3;
  const number = getRandomArbitrary(min, 11);
  for (let i = min; i < number; i++) {
    values.push(`test-${i}`);
  }

  return values;
};

const getQueriesFromObservableQueries = (
  observableQueries: Map<string, ObservableQuery>
): IWatchQueryInfo[] => {
  const queries: IWatchQueryInfo[] = [];
  if (observableQueries) {
    observableQueries.forEach((oc) => {
      const observableQuery = getPrivateAccess(oc);
      const { document, variables } = observableQuery.queryInfo;
      const diff = observableQuery.queryInfo.getDiff();
      if (!document) return;

      queries.push({
        document,
        variables,
        data: diff.result,
      });
    });
  }
  return queries;
};

const getQueries = (
  queryMap: Map<
    string,
    {
      document: DocumentNode;
      variables: VariableDefinitionNode;
      diff: Cache.DiffResult<any>;
    }
  >
): IWatchQueryInfo[] => {
  if (queryMap) {
    const queries = [...queryMap.values()].map(
      ({ document, variables, diff }) => ({
        document,
        variables,
        data: diff?.result,
      })
    );

    return queries;
  }
  return [];
};
