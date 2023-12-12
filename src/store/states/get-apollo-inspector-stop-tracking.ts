import { ISet, IStopApolloInspectorTracking } from "../store.interface";
import { IDataView } from "apollo-inspector";
import { createState } from "../create-state";

export const getApolloInspectorStopTracking = (
  set: ISet
): IStopApolloInspectorTracking => {
  const temp = {
    operations: null,
    verboseOperations: null,
    allOperations: null,
    affectedQueriesOperations: null,
  };
  const [stopApolloInspectorTracking, setStopApolloInspectorTracking] =
    createState(
      () => {
        return temp;
      },
      "stopApolloInspectorTracking",
      set
    );
  return {
    stopApolloInspectorTracking,
    setStopApolloInspectorTracking,
  };
};
