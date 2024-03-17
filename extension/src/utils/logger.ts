// This is temporary
import { Queue } from "@datastructures-js/queue";
import { IMessagePayload } from "./custom-event-target";

const enableStoringLogs = false;
const enableLogger = false;
const enableLoggingData = false;

const logs = new Queue();
const size = 1000;
if (enableStoringLogs) {
  (self as any).logs = logs;
}

interface IData {
  message?: IMessagePayload;
  data?: any;
  log?: any;
}

export const createLogger = (name: string) => {
  return (message: string, data: IData) => {
    if (!enableLogger && !enableLoggingData && !enableStoringLogs) {
      return;
    }

    const logStatement = `${Date.now()} [${name}] ${message} ${
      data.message
        ? `from=${data.message.requestInfo.sender} to=${data.message.destination.name} action:${data.message.destination.action} requestId=${data.message.requestInfo.requestId} tabId=${data.message.destination.tabId}`
        : ``
    } logData:${JSON.stringify(data.log)}`;
    enableStoringLogs && addToQueue(logStatement);

    if (enableLogger && enableLoggingData) {
      console.log(logStatement, data);

      return;
    }
    if (enableLogger) {
      console.log(logStatement);
      return;
    }
  };
};

const addToQueue = (logStatement: string) => {
  if (logs.size() === size) {
    logs.dequeue();
  }
  logs.enqueue(logStatement);
};
