import { Context } from "./constants";

export const getLastSender = (path: Context[]) => {
  if (path.length >= 2) {
    return path[path.length - 2];
  }
  return path[path.length - 1];
};
