import browser from "webextension-polyfill";
import { CustomEventTarget, IMessagePayload, createLogger } from "../utils";
import { IDevtoolContext } from "./devtools.interface";
import { DevtoolsPanels } from "webextension-polyfill/namespaces/devtools_panels";

export const sendMessageToBackgroundScript = ({
  backgroundConnection,
}: {
  backgroundConnection: browser.Runtime.Port;
}) => {
  return (message: IMessagePayload) => {
    logMessage(`imp! sending message to background`, message);
    backgroundConnection.postMessage(message);
  };
};

export const handleMessageForDevtool = ({
  devtools,
}: {
  devtools: CustomEventTarget;
}) => {
  return (message: IMessagePayload) => {
    const action = message.destination.action;
    const event = new CustomEvent(action, { detail: message });
    devtools.dispatchEvent(event);
  };
};

export const createDevtoolsPanel = (context: IDevtoolContext) => {
  const { devtoolState } = context;
  return async (message: IMessagePayload) => {
    if (devtoolState.isPanelCreated) {
      return;
    }
    const panel: DevtoolsPanels.ExtensionPanel =
      await browser.devtools.panels.create(
        "Apollo Inspector",
        "",
        "panel.html"
      );

    devtoolState.isPanelCreated = true;
    panel.onShown.addListener((panelWindow: Window) => {
      logMessage(`panel shown`, {});
    });

    panel.onHidden.addListener((panelWindow: Window) => {
      logMessage(`panel hidden`, {});
    });
  };
};

const logMessage = createLogger(`devtools`);
