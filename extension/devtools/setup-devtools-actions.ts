import {
  DEVTOOL,
  DEVTOOLS_ACTIONS,
  WEB_PAGE,
  PANEL_PAGE,
  CONTENT_SCRIPT,
} from "../utils";
import {
  sendMessageToBackgroundScript,
  handleMessageForDevtool,
  createDevtoolsPanel,
} from "./devtool-actions";
import { IDevtoolContext } from "./devtools.interface";

export const setupDevtoolActions = (context: IDevtoolContext) => {
  const { backgroundConnection, devtools } = context;
  const actionsToReducers = {
    [DEVTOOLS_ACTIONS.CREATE_DEVTOOLS_PANEL]: createDevtoolsPanel(context),
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
