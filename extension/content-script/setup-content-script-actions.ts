import {
  DEVTOOL,
  IMessagePayload,
  CONTENT_SCRIPT,
  WEB_PAGE,
  CONTENT_SCRIPT_ACTIONS,
  IContentScriptContext,
  CustomEventTarget,
  PANEL_PAGE,
  DEVTOOLS_ACTIONS,
  WEBPAGE_ACTIONS,
} from "../utils";
import {
  getTabId,
  getDevtoolAction,
  getContentScriptAction,
  getWebpageAction,
} from "./content-script-actions";

export const setupContentScriptsActions = (context: IContentScriptContext) => {
  const { contentScript, addToCleanUp } = context;

  const actionToReducers = {
    [CONTENT_SCRIPT_ACTIONS.GET_TAB_ID]: getTabId(context),
    [DEVTOOLS_ACTIONS.DEVTOOLS_SCRIPT_LOADED]: (_: string) => {
      return _;
    },
    [WEBPAGE_ACTIONS.GET_APOLLO_CLIENTS_IDS]: (_: number) => {
      return _;
    },
    [DEVTOOL]: getDevtoolAction(context),
    [CONTENT_SCRIPT]: getContentScriptAction(context),
    [WEB_PAGE]: getWebpageAction(context),
    [PANEL_PAGE]: getDevtoolAction(context),
  };

  for (const prop in actionToReducers) {
    const modifiedProp = prop as CONTENT_SCRIPT_ACTIONS;

    addToCleanUp(
      contentScript.addEventListener(
        modifiedProp,
        actionToReducers[modifiedProp]
      )
    );
  }

  listenToPostMessage(contentScript, addToCleanUp);
};

export const setupInitialContentScriptAction = (
  contentScript: CustomEventTarget,
  addToCleanUp: () => void
) => {
  const actionToReducers = {
    [CONTENT_SCRIPT_ACTIONS.GET_TAB_ID]: getTabId(contentScript),
  };

  for (const prop in actionToReducers) {
    const modifiedProp = prop as CONTENT_SCRIPT_ACTIONS;

    addToCleanUp(
      contentScript.addEventListener(
        modifiedProp,
        actionToReducers[modifiedProp]
      )
    );
  }
};

function listenToPostMessage(
  contentScript: CustomEventTarget,
  addToCleanUp: (removeListener: () => void) => void
) {
  const listener = (event: { data: IMessagePayload }) => {
    const message = event.data;
    message.destination?.name &&
      logMessage(
        `message received at content-script from postmessage`,
        message
      );
    const customEvent = new CustomEvent(event.data?.destination?.name, {
      detail: message,
    });
    contentScript.dispatchEvent(customEvent);
  };
  window.addEventListener("message", listener);
  addToCleanUp(() => {
    window.removeEventListener("message", listener);
  });
}

function logMessage(message: string, data: any) {
  console.log(`[content-script]AIE ${message}`, { data });
}
