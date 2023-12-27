import {
  IMessagePayload,
  CONTENT_SCRIPT,
  WEB_PAGE,
  WEBPAGE_ACTIONS,
  IContentScriptContext,
} from "../utils";

export const getTabId = ({ contentScript, tabId }: IContentScriptContext) => {
  return () => {
    const message: IMessagePayload = {
      destination: {
        name: WEB_PAGE,
        action: WEBPAGE_ACTIONS.TAB_ID_VALUE,
        tabId,
      },
      requestInfo: {
        requestId: `${CONTENT_SCRIPT}:${Date.now()}`,
      },
    };
    const event = new CustomEvent(message.destination.name, {
      detail: message,
    });
    contentScript.dispatchEvent(event);
  };
};

function logMessage(message: string, data: any) {
  console.log(`[content-script-actions]AIE ${message}`, { data });
}

export const getDevtoolAction = ({
  backgroundService,
}: IContentScriptContext) => {
  return (message: IMessagePayload) => {
    logMessage(`sending event to devtool `, message);

    backgroundService.postMessage(message);
  };
};

export const getContentScriptAction = (context: IContentScriptContext) => {
  const { contentScript } = context;
  return (message: IMessagePayload) => {
    const event = new CustomEvent(message.destination.action, {
      detail: message,
    });
    contentScript.dispatchEvent(event);
  };
};

export const getWebpageAction = (context: IContentScriptContext) => {
  return (message: IMessagePayload) => {
    logMessage(` sending message to webpage`, message);
    window.postMessage(message, "*");
  };
};
