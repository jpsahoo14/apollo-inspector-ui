import { Queue } from "@datastructures-js/queue";
import { createLogger } from "./logger";
import { EventTarget } from "event-target-shim";
import { Context } from "./constants";

type callback = (message: IMessagePayload) => void;
export class CustomEventTarget {
  private eventTarget: EventTarget;
  private maxSize = 500;
  private queue: Queue<string>;
  private set: Set<string>;
  private name: Context;
  private eventNames: string[];
  private connectionsListenersMap: Map<number, callback>;
  private connectionsListenerIndex = 0;

  constructor(name: Context) {
    this.eventTarget = new EventTarget();
    this.queue = new Queue<string>();
    this.set = new Set<string>();
    this.name = name;
    this.eventNames = [];
    this.connectionsListenersMap = new Map<number, callback>();
  }

  /**
   * Adds event listener for a specific type
   * @param type
   * @param callback
   * @param options
   * @returns
   */
  public addEventListener<T>(
    type: string,
    callback: (message: T) => void,
    options?: EventTarget.AddOptions
  ): () => void {
    this.eventNames.push(type);
    const listener: EventTarget.EventListener<any, any> | null = (
      message: CustomEvent<T>
    ) => {
      try {
        callback?.(message.detail);
      } catch (e) {
        console.log(`caught exception in callback listener`, e);
      }
    };

    this.eventTarget.addEventListener(type, listener, options);

    return () => this.eventTarget.removeEventListener(type, listener, options);
  }

  /**
   * Adds a connection listener, which forwards the message
   * to the connection.
   * @param callback
   * @returns
   */
  public addConnectionListeners(callback: callback) {
    const index = this.connectionsListenerIndex;
    this.connectionsListenersMap.set(index, callback);
    this.connectionsListenerIndex++;

    return () => {
      this.connectionsListenersMap.delete(index);
    };
  }

  public dispatchEvent(event: CustomEvent<IMessagePayload>) {
    event.detail?.requestInfo &&
      event.detail?.destination &&
      logMessage(`dispatching event type:${event.type}`, {
        message: event.detail,
        data: {
          eventNames: this.eventNames,
        },
      });
    if (this.shouldHandle(event)) {
      const key = this.getSetKey(event);
      if (!this.set.has(key)) {
        this.addToQueue(event);
        event.detail.requestInfo.path.push(this.name);
        this.dispatchEventInternally(event);
        this.dispatchEventToConnections(event);
      } else {
        logMessage(`key already present`, {
          message: event.detail,
          data: {
            queue: this.queue.toArray(),
            set: this.set.keys(),
            name: this.name,
            key,
          },
        });
      }
    }
  }

  private dispatchEventInternally(event: CustomEvent<IMessagePayload>) {
    this.eventTarget.dispatchEvent(event);
  }

  private dispatchEventToConnections(event: CustomEvent<IMessagePayload>) {
    this.connectionsListenersMap.forEach((value) => value(event.detail));
  }

  private shouldHandle(event: CustomEvent<IMessagePayload>) {
    if (
      event.detail.destination?.action &&
      event.detail.requestInfo?.requestId
    ) {
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
    sender: Context;
    path: Context[];
  };
  destination: {
    /**
     * @deprecated Use the action property.
     */
    name?: string;
    tabId: number;
    action: string;
  };
  data?: any;
}

const logMessage = createLogger(`listeners`);
