import { Queue } from "@datastructures-js/queue";
import { createLogger } from "./logger";

export class CustomEventTarget {
  private eventTarget: EventTarget;
  private maxSize = 10;
  private queue: Queue<string>;
  private set: Set<string>;
  private name: string;
  private eventNames: string[];
  constructor(name: string) {
    this.eventTarget = new EventTarget();
    this.queue = new Queue<string>();
    this.set = new Set<string>();
    this.name = name;
    this.eventNames = [];
  }

  addEventListener<T>(
    type: string,
    callback: (message: T) => void,
    options?: boolean | AddEventListenerOptions | undefined
  ): () => void {
    this.eventNames.push(type);
    const listener = (message: CustomEvent) => {
      callback?.(message.detail);
    };

    this.eventTarget.addEventListener(type, listener, options);

    return () => this.eventTarget.removeEventListener(type, listener, options);
  }

  dispatchEvent(event: CustomEvent<IMessagePayload>) {
    event.detail?.requestInfo &&
      event.detail?.destination &&
      logMessage(
        `dispatching event in:${this.name} type:${event.type} from:${event.detail.requestInfo.sender} to:${event.detail.destination.name} action:${event.detail.destination.action}`,
        { message: event.detail, eventNames: this.eventNames }
      );
    if (this.shouldHandle(event)) {
      const key = this.getSetKey(event);
      if (!this.set.has(key)) {
        this.addToQueue(event);
        this.eventTarget.dispatchEvent(event);
      } else {
        logMessage(`key already present`, {
          message: event.detail,
          queue: this.queue.toArray(),
          set: this.set.keys(),
          name: this.name,
          key,
        });
      }
    }
  }

  private shouldHandle(event: CustomEvent<IMessagePayload>) {
    if (event.detail.destination?.name) {
      return true;
    }

    return false;
  }

  private getSetKey(event: CustomEvent<IMessagePayload>) {
    const key = `${event.detail.requestInfo.requestId}:${event.type}`;
    return key;
  }

  private addToQueue(event: CustomEvent<IMessagePayload>) {
    const key = this.getSetKey(event);
    if (this.queue.size() === this.maxSize) {
      const element = this.queue.dequeue();
      this.set.delete(element);
    }

    this.queue.enqueue(key);
    this.set.add(key);
  }
}

export interface IMessagePayload {
  requestInfo: {
    requestId: string;
    sender: string;
  };
  destination: {
    name: string;
    tabId: number;
    action: string;
  };
  data?: any;
}

const logMessage = createLogger(`listeners`);
