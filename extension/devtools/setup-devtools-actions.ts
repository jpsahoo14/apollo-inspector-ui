import {
  CONTENT_SCRIPT_ACTIONS,
  CONTENT_SCRIPT,
  DEVTOOL,
  DEVTOOLS_ACTIONS,
  PANEL_PAGE,
  WEB_PAGE,
} from "../utils";
import {
  createDevtoolsPanel,
  handleMessageForDevtool,
  sendMessageToBackgroundScript,
} from "./devtool-actions";
import { IDevtoolContext } from "./devtools.interface";

export const setupDevtoolActions = (context: IDevtoolContext) => {
  const { backgroundConnection, devtools } = context;
  const actionsToReducers = {
    [DEVTOOLS_ACTIONS.CREATE_DEVTOOLS_PANEL]: createDevtoolsPanel(context),
    [CONTENT_SCRIPT_ACTIONS.CONTENT_SCRIPT_INIT_COMPLETE]:
      createDevtoolsPanel(context),
    [CONTENT_SCRIPT]: sendMessageToBackgroundScript({
      backgroundConnection,
    }),
    [WEB_PAGE]: sendMessageToBackgroundScript({ backgroundConnection }),
    [PANEL_PAGE]: sendMessageToBackgroundScript({ backgroundConnection }),
    [DEVTOOL]: handleMessageForDevtool({ devtools }),
  };

  for (const prop in actionsToReducers) {
    devtools.addEventListener(prop, actionsToReducers[prop]);
  }
};
