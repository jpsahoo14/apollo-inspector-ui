import { IStore, ISet } from "./store.interface";
import { produce } from "immer";

type IStoreKeys = keyof IStore;

export const createState = <T>(
  initialValue: T,
  key: IStoreKeys,
  set: ISet
): [T, (value: T | ((prevState: T) => T)) => void] => {
  const state = initialValue;

  const updateState = (value: T | ((prevState: T) => T)): void => {
    set((store: IStore) => {
      const nextState = produce(store, (draft: IStore) => {
        if (typeof value === "function") {
          draft[key] = value(store[key]);
        } else {
          draft[key] = value;
        }
      });
      return nextState;
    });
  };

  return [state, updateState];
};
