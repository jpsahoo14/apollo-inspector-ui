import { Subscription } from "rxjs";
import { CustomEventTarget } from "../utils";

export interface IWebpageContext {
  webpage: CustomEventTarget;
  tabId: number;
  webpageStore: IWebpageStore;
}

export interface IWebpageStore {
  apolloInspectorSubscription: Subscription | null;
}
