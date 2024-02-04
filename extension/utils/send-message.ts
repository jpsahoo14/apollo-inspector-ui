import { CustomEventTarget, IMessagePayload } from "./custom-event-target";
import { generateRequestInfo } from "./generate-request-id";
import { Context } from "./constants";

interface ISendPostMessageParams {
  action: string;
  destinationName: string;
  tabId: number;
  callerName: Context;
}
export const sendPostMessage = (
  eventTarget: CustomEventTarget,
  { action, destinationName, tabId, callerName }: ISendPostMessageParams
) => {
  sendMessageViaEventTarget(eventTarget, {
    action,
    destinationName: destinationName,
    tabId,
    callerName,
  });
};

interface ISendMessageParams {
  action: string;
  destinationName: string;
  tabId: number;
  callerName: Context;
  data?: any;
}
export const sendMessageViaEventTarget = (
  eventTarget: CustomEventTarget,
  { action, destinationName, tabId, callerName, data }: ISendMessageParams
) => {
  const message: IMessagePayload = {
    destination: {
      action,
      name: destinationName,
      tabId,
    },
    requestInfo: {
      ...generateRequestInfo(callerName, action),
    },
    data,
  };

  const event = new CustomEvent(message.destination.action, {
    detail: message,
  });

  eventTarget.dispatchEvent(event);
};
