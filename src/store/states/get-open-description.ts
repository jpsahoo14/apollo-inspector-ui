import { ISet, IOpenDescriptionStore } from "../store.interface";
import { createState } from "../create-state";

export const getOpenDescriptionStore = (set: ISet): IOpenDescriptionStore => {
  const [openDescription, setOpenDescription] = createState(false, "openDescription", set);
  return {
    openDescription,
    setOpenDescription,
  };
};
