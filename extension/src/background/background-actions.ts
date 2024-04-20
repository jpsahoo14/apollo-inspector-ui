import { IMessagePayload, createLogger, Context } from "../utils";
import { IBackgroundContext } from "./background.interface";

export const getDispatchEventEventWithinBackgroundService = (
  context: IBackgroundContext
) => {
  return (message: IMessagePayload) => {
    const { backgroundEventTarget } = context;
    logMessage(`sending message to TO_BACKGROUND`, { message });

    const event = new CustomEvent(message.destination.action, {
      detail: message,
    });
    backgroundEventTarget.dispatchEvent(event);
  };
};

const logMessage = createLogger(Context.BACKGROUND);
