import { IStore, ISet } from "./store.interface";
import { produce } from "immer";
import { cloneDeep } from "lodash";
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
          console.log(value);
          draft[key] = value(store[key]);
        } else {
          draft[key] = value;
        }
      });
      console.log({ key: cloneDeep(key), value: cloneDeep(value), store: cloneDeep(store), nextState: cloneDeep(nextState) });
      return nextState;
    });
  };

  // console.log({ state, key, initialValue, updateState });
  return [state, updateState];
};
