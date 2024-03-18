import { CustomEventTarget } from "../utils";

export interface IContentScriptStore {
  tabId: number | undefined;
  cleanUps: (() => void)[];
}

export interface IContentScriptInitialContext {
  contentScript: CustomEventTarget;
  store: IContentScriptStore;
  addToCleanUp: (cleanUp: () => void) => void;
}
