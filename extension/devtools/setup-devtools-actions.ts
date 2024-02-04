import { CONTENT_SCRIPT_ACTIONS, DEVTOOLS_ACTIONS, Context } from "../utils";
import {
  createDevtoolsPanel,
  handleMessageForDevtool,
  sendMessageToBackgroundScript,
  getContentScriptLoadedMethod,
  getHandleWebpageUnload,
} from "./devtool-actions";
import { IDevtoolContext } from "./devtools.interface";

export const setupDevtoolActions = (context: IDevtoolContext) => {
  const { backgroundConnection, devtools } = context;
  const cleanUps: (() => void)[] = [];

  const actionsToReducers = {
    [DEVTOOLS_ACTIONS.CREATE_DEVTOOLS_PANEL]: createDevtoolsPanel(context),
    [CONTENT_SCRIPT_ACTIONS.CONTENT_SCRIPT_INIT_COMPLETE]:
      getContentScriptLoadedMethod(context),
    [CONTENT_SCRIPT_ACTIONS.CONTENT_SCRIPT_UNLOAD]:
      getHandleWebpageUnload(context),
    [Context.DEVTOOL]: handleMessageForDevtool({ devtools }),
  };

  for (const prop in actionsToReducers) {
    cleanUps.push(devtools.addEventListener(prop, actionsToReducers[prop]));
  }
  return () => {
    cleanUps.forEach((cleanUp) => cleanUp());
  };
};
