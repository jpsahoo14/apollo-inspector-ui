import { IPanelContext } from "./panel.interface";
import {
  BACKGROUND,
  CONTENT_SCRIPT,
  DEVTOOL,
  PANEL_PAGE,
  PANEL_PAGE_ACTIONS,
  WEB_PAGE,
} from "../utils";
import {
  getSetApolloClientIds,
  sendMessageFromPanelPage,
  getHandlePanelPageActions,
} from "./panel-actions";

export const setupPanelActions = (context: IPanelContext) => {
  const { panel } = context;
  const actionsToReducers = {
    [PANEL_PAGE_ACTIONS.SET_APOLLO_CLIENT_IDS]: getSetApolloClientIds(context),
    [WEB_PAGE]: sendMessageFromPanelPage(context),
    [BACKGROUND]: sendMessageFromPanelPage(context),
    [DEVTOOL]: sendMessageFromPanelPage(context),
    [CONTENT_SCRIPT]: sendMessageFromPanelPage(context),
    [PANEL_PAGE]: getHandlePanelPageActions(context),
  };

  for (const prop in actionsToReducers) {
    panel.addEventListener(prop, actionsToReducers[prop]);
  }
};
