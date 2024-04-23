import { IVerboseOperation } from "apollo-inspector";
import {
  ISet,
  ISelectedOperationInAffectedQueriesView,
} from "../store.interface";
import { createState } from "../create-state";

export const getSelectedOperationInAffectedQueriesView = (
  set: ISet
): ISelectedOperationInAffectedQueriesView => {
  const [
    selectedOperationInAffectedQueriesView,
    setSelectedOperationInAffectedQueriesView,
  ] = createState<IVerboseOperation | null | undefined>(
    null,
    "selectedOperationInAffectedQueriesView",
    set
  );

  return {
    selectedOperationInAffectedQueriesView,
    setSelectedOperationInAffectedQueriesView,
  };
};
