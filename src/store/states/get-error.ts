import { ISet, IErrorStore } from "../store.interface";
import { createState } from "../create-state";

export const getErrorStore = (set: ISet): IErrorStore => {
  const [error, setError] = createState(
    { message: "", error: null },
    "error",
    set
  );

  return { error, setError };
};
