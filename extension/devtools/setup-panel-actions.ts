import { IPanelContext } from "./panel.interface";
import {
  BACKGROUND,
  CONTENT_SCRIPT,
  CONTENT_SCRIPT_ACTIONS,
  DEVTOOL,
  PANEL_PAGE,
  WEB_PAGE,
  WEBPAGE_ACTIONS,
} from "../utils";
import {
  sendMessageFromPanelPage,
  getHandlePanelPageActions,
  getHandleWebPageUnload,
  contentScriptLoaded,
  getCopyData,
} from "./panel-actions";

export const setupPanelActions = (context: IPanelContext) => {
  const { panel } = context;
  const actionsToReducers = {
    [WEB_PAGE]: sendMessageFromPanelPage(context),
    [BACKGROUND]: sendMessageFromPanelPage(context),
    [DEVTOOL]: sendMessageFromPanelPage(context),
    [CONTENT_SCRIPT]: sendMessageFromPanelPage(context),
    [PANEL_PAGE]: getHandlePanelPageActions(context),
    [WEBPAGE_ACTIONS.WHOLE_APOLLO_CACHE_DATA]: getCopyData(context),
    [WEBPAGE_ACTIONS.WEB_PAGE_UNLOAD]: getHandleWebPageUnload(context),
    [CONTENT_SCRIPT_ACTIONS.CONTENT_SCRIPT_INIT_COMPLETE]:
      contentScriptLoaded(context),
  };

  for (const prop in actionsToReducers) {
    panel.addEventListener(prop, actionsToReducers[prop]);
  }
};
