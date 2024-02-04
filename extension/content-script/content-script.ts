import browser from "webextension-polyfill";
import { CustomEventTarget, createLogger, Context } from "../utils";
import {
  IContentScriptInitialContext,
  IContentScriptStore,
} from "./content-script.interface";
import { setupInitialContentScriptAction } from "./setup-content-script-actions";

async function init() {
  const cleanUps: (() => void)[] = [];
  const addToCleanUp: (cleanUp: () => void) => void = (cleanUp: () => void) => {
    cleanUps.push(cleanUp);
  };
  const contentScriptStore: IContentScriptStore = {
    tabId: undefined,
    cleanUps,
  };

  const contentScriptEventTarget = new CustomEventTarget(
    Context.CONTENT_SCRIPT
  );

  const context: IContentScriptInitialContext = {
    addToCleanUp,
    contentScript: contentScriptEventTarget,
    store: contentScriptStore,
  };
  setupInitialContentScriptAction(context);

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
}

const logMessage = createLogger(`content-script`);

init();
