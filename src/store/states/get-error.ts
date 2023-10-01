import { ISet, IErrorStore, IErrorType, IError } from "../store.interface";
import { createState } from "../create-state";

export const getErrorStore = (set: ISet): IErrorStore => {
  const [error, setError] = createState<IError>(
    { message: "", error: null, type: IErrorType.Normal },
    "error",
    set
  );

  return { error, setError };
};
