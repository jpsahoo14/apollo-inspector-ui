import {
  CONTENT_SCRIPT,
  CustomEventTarget,
  IMessagePayload,
  WEBPAGE_ACTIONS,
  WEB_PAGE,
  createLogger,
  sendMessageViaEventTarget,
} from "../utils";
import { setupWebPageActions } from "./setup-web-page-actions";
import { getTabId } from "./web-page-actions";
import { IWebpageStore } from "./web-page.interface";

(async function () {
  const webpage = new CustomEventTarget("web-page");
  const webpageStore: IWebpageStore = {
    apolloInspectorSubscription: null,
  };

  const tabId: number = await getTabId();
  setupWebPageActions({ webpage, tabId, webpageStore });
  listenToPostMessage(webpage);
  sendMessageViaEventTarget(webpage, {
    destinationName: CONTENT_SCRIPT,
    action: WEBPAGE_ACTIONS.WEB_PAGE_INIT_COMPLETE,
    tabId,
    callerName: WEB_PAGE,
  });

  function listenToPostMessage(webpage: CustomEventTarget) {
    window.addEventListener("message", (event: { data: IMessagePayload }) => {
      if (!event.data?.destination) {
        return;
      }

      logMessage(`message recieved at web-page`, { data: event.data });
      const customEvent = new CustomEvent(event.data.destination.name, {
        detail: event.data,
      });
      webpage.dispatchEvent(customEvent);
    });
  }
})();

const logMessage = createLogger(`mainThread`);

logMessage(`apollo inspector script started`, {});
