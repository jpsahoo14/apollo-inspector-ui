import {
  DEVTOOL,
  PANEL_PAGE,
  WEB_PAGE,
  WEBPAGE_ACTIONS,
  DEVTOOLS_ACTIONS,
  PANEL_PAGE_ACTIONS,
} from "../utils";
import {
  devtoolScriptLoadedAction,
  sendMessage,
  getApolloClientsIdsAction,
  getHandleWebpageAction,
  getStartRecordingAction,
  getStopRecordingReducer,
} from "./web-page-actions";
import { IWebpageContext } from "./web-page.interface";

export const setupWebPageActions = (context: IWebpageContext) => {
  const { webpage } = context;

  const actionsToReducers = {
    [WEBPAGE_ACTIONS.GET_APOLLO_CLIENTS_IDS]:
      getApolloClientsIdsAction(context),
    [DEVTOOLS_ACTIONS.DEVTOOLS_SCRIPT_LOADED]:
      devtoolScriptLoadedAction(context),
    [DEVTOOLS_ACTIONS.DISCONNECTED]: getStopRecordingReducer(context),
    [PANEL_PAGE_ACTIONS.START_RECORDING]: getStartRecordingAction(context),
    [PANEL_PAGE_ACTIONS.STOP_RECORDING]: getStopRecordingReducer(context),
    [DEVTOOL]: sendMessage,
    [PANEL_PAGE]: sendMessage,
    [WEB_PAGE]: getHandleWebpageAction(context),
  };

  for (const prop in actionsToReducers) {
    webpage.addEventListener(prop, actionsToReducers[prop]);
  }
};
