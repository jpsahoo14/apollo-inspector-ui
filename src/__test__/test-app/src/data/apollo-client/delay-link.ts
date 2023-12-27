import { ApolloLink, Observable } from "@apollo/client";

const delayTimeInMS = 500;
export const delayLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const forwardObservable = forward(operation);
    forwardObservable.subscribe({
      next: (args: any) => {
        delayOperation(delayTimeInMS, () => observer.next(args));
      },
      error: (args: any) => {
        delayOperation(delayTimeInMS, () => observer.error(args));
      },
      complete: () => {
        delayOperation(delayTimeInMS, () => observer.complete());
      },
    });
  });
});

const delayOperation = (time: number, fn: () => void) => {
  setTimeout(fn, time);
};
