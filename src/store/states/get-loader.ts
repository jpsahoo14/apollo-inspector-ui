import { ISet, ILoaderStore, ILoader, IStore } from "./store.interface";
import { createState } from "./create-state";

export const getLoaderStore = (set: ISet): ILoaderStore => {
  const [loader, setLoader] = createState(
    { message: "", loading: false },
    "loader",
    set
  );

  return { loader, setLoader };
};
