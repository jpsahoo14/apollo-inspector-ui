// This is temporary
import { Queue } from "@datastructures-js/queue";
import { IMessagePayload } from "./custom-event-target";

const enableStoringLogs = false;
const enableLogger = false;
const enableLoggingData = false;

const logsQueue = new Queue();
const LOGS_SIZE = 1000;
if (enableStoringLogs) {
  (self as any).logs = logsQueue;
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

    const logStatement = `${getCurrentDateTime()} AI-UI [${name}] ${message} ${
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

const getCurrentDateTime = () => {
  var timestamp = Date.now();

  // Create a new Date object with the timestamp
  var date = new Date(timestamp);

  // Get individual components of the date (year, month, day, hours, minutes, seconds)
  var year = date.getFullYear();
  var month = date.getMonth() + 1; // Months are zero-based, so we add 1
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  // Format the date and time as a string
  var formattedDate =
    year +
    "-" +
    addZero(month) +
    "-" +
    addZero(day) +
    " " +
    addZero(hours) +
    ":" +
    addZero(minutes) +
    ":" +
    addZero(seconds);

  // Function to add leading zero if the value is less than 10
  function addZero(value: number) {
    return value < 10 ? "0" + value : value;
  }

  // Output the formatted date
  return formattedDate;
};

const addToQueue = (logStatement: string) => {
  if (logsQueue.size() === LOGS_SIZE) {
    logsQueue.dequeue();
  }
  logsQueue.enqueue(logStatement);
};
