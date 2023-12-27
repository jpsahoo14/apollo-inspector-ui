import browser from "webextension-polyfill";
import { CustomEventTarget, IMessagePayload } from "../utils";
import { IDevtoolContext } from "./devtools.interface";

export const sendMessageToBackgroundScript = ({
  backgroundConnection,
}: {
  backgroundConnection: browser.Runtime.Port;
}) => {
  return (message: IMessagePayload) => {
    logMessage(`sending message to background`, message);
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
    const panel = await browser.devtools.panels.create(
      "Apollo Inspector",
      "",
      "panel.html"
    );

    devtoolState.isPanelCreated = true;
    panel.onShown.addListener((panelWindow: Window) => {});

    panel.onHidden.addListener((panelWindow: Window) => {});
  };
};

function logMessage(message: string, data: any) {
  console.log(`[devtools]AIE ${message}`, { data });
}
