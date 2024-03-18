import { IMessagePayload } from "./custom-event-target";
import { Context } from "./constants";

export const generateRequestInfo = (
  name: Context,
  action: string
): IMessagePayload["requestInfo"] => {
  return {
    requestId: `${name}:${action}:${Date.now()}`,
    sender: name,
    path: [],
  };
};
