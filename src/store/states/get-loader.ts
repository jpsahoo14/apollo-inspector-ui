import { ISet, ILoaderStore, ILoader, IStore } from "../store.interface";
import { createState } from "../create-state";

export const getLoaderStore = (set: ISet): ILoaderStore => {
  const [loader, setLoader] = createState(initialLoaderState(), "loader", set);

  return { loader, setLoader };
};

export const initialLoaderState = () => ({ message: "", loading: false });
