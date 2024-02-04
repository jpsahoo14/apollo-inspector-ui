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
  const cleanUps: (() => void)[] = [];

  const actionsToReducers = {
    [PANEL_PAGE]: getHandlePanelPageActions(context),
    [WEBPAGE_ACTIONS.WHOLE_APOLLO_CACHE_DATA]: getCopyData(context),
    [CONTENT_SCRIPT_ACTIONS.CONTENT_SCRIPT_UNLOAD]:
      getHandleWebPageUnload(context),
    [CONTENT_SCRIPT_ACTIONS.CONTENT_SCRIPT_INIT_COMPLETE]:
      contentScriptLoaded(context),
  };

  for (const prop in actionsToReducers) {
    cleanUps.push(panel.addEventListener(prop, actionsToReducers[prop]));
  }

  cleanUps.push(
    panel.addConnectionListeners(sendMessageFromPanelPage(context))
  );

  return () => {
    cleanUps.forEach((cleanUp) => cleanUp());
  };
};
