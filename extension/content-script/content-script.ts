import browser from "webextension-polyfill";
import { CustomEventTarget, IMessagePayload, CONTENT_SCRIPT } from "../utils";
import { setupContentScriptsActions } from "./setup-content-script-actions";
import { IContentScriptStore } from "./content-script.interface";

async function init() {
  const contentScriptStore: IContentScriptStore = {
    tabId: undefined,
  };
  const cleanUps: (() => void)[] = [];

  const addToCleanUp = (cleanUp: () => void) => {
    cleanUps.push(cleanUp);
  };

  const clientEventTarget = new CustomEventTarget("content-script");

  if (typeof document === "object" && document instanceof HTMLDocument) {
    const script = document.createElement("script");
    script.setAttribute("type", "module");
    script.setAttribute("src", browser.runtime.getURL("webpage.js"));
    document.addEventListener("DOMContentLoaded", () => {
      const importMap = document.querySelector('script[type="importmap"]');
      if (importMap != null) {
        importMap.parentNode?.insertBefore(script, importMap.nextSibling);
      } else {
        const head =
          document.head ||
          document.getElementsByTagName("head")[0] ||
          document.documentElement;
        head.insertBefore(script, head.lastChild);
      }
    });
  }

  const getTabId = async (): Promise<number> => {
    const tabId: number = await browser.runtime.sendMessage({
      type: "GET_TAB_ID",
    });
    return tabId;
  };

  const tabId = await getTabId();

  const connectionToBackgroundService: browser.Runtime.Port =
    browser.runtime.connect({
      name: `${JSON.stringify({ name: CONTENT_SCRIPT, tabId })}`,
    });

  connectionToBackgroundService.onMessage.addListener(
    (message: IMessagePayload) => {
      logMessage(`message received at content-script`, message);
      const event = new CustomEvent(message.destination.name, {
        detail: message,
      });
      clientEventTarget.dispatchEvent(event);
    }
  );

  setupContentScriptsActions({
    contentScript: clientEventTarget,
    backgroundService: connectionToBackgroundService,
    addToCleanUp,
    tabId,
  });
  connectionToBackgroundService.onDisconnect.addListener((port) => {
    cleanUps.forEach((cleanUp) => cleanUp());
  });

  // addToCleanUp(setIntervalToGetApolloClients(clientEventTarget));
}

function logMessage(message: string, data: any) {
  console.log(`[content-script]AIE ${message}`, { data });
}
init();
