import {
  CustomEventTarget,
  WEBPAGE_ACTIONS,
  createLogger,
  sendMessageViaEventTarget,
  Context,
} from "../utils";
import { setupWebPageActions } from "./setup-web-page-actions";
import { getTabId } from "./web-page-actions";
import { IWebpageStore } from "./web-page.interface";

(async function () {
  const webpage = new CustomEventTarget(Context.WEB_PAGE);
  const webpageStore: IWebpageStore = {
    apolloInspectorSubscription: null,
  };

  const tabId: number = await getTabId();
  setupWebPageActions({ webpage, tabId, webpageStore });

  sendMessageViaEventTarget(webpage, {
    destinationName: Context.CONTENT_SCRIPT,
    action: WEBPAGE_ACTIONS.WEB_PAGE_INIT_COMPLETE,
    tabId,
    callerName: Context.WEB_PAGE,
  });
})();

const logMessage = createLogger(`mainThread`);

logMessage(`apollo inspector web-script started`, {});
