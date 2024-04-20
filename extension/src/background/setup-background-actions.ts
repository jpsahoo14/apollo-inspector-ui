import { Context, PANEL_PAGE_ACTIONS } from "../utils";
import { IBackgroundContext } from "./background.interface";
import { getDispatchEventEventWithinBackgroundService } from "./background-actions";

export const setupBackgroundActions = (context: IBackgroundContext) => {
  const { backgroundEventTarget } = context;
  const actionsToReducers = {
    [Context.BACKGROUND]: getDispatchEventEventWithinBackgroundService(context),
    [PANEL_PAGE_ACTIONS.START_RECORDING]: () => {},
    [PANEL_PAGE_ACTIONS.STOP_RECORDING]: () => {},
  };

  for (const prop in actionsToReducers) {
    backgroundEventTarget.addEventListener(prop, actionsToReducers[prop]);
  }
};
