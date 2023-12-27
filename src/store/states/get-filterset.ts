import { ISet, IFilterSetStore, IFilterSet, IStore } from "../store.interface";
import { createState } from "../create-state";

export const getFilterSetStore = (set: ISet): IFilterSetStore => {
  const [filterSet, setFilterSet] = createState(
    { results: [], types: [], statuses: [] },
    "filterSet",
    set
  );

  return { filterSet, setFilterSet };
};
