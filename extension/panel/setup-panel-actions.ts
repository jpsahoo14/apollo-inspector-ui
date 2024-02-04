import { IPanelContext } from "./panel.interface";
import { CONTENT_SCRIPT_ACTIONS, WEBPAGE_ACTIONS, Context } from "../utils";
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
    [Context.PANEL_PAGE]: getHandlePanelPageActions(context),
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
