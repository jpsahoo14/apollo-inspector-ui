import { ISet, IStopApolloInspectorTracking } from "../store.interface";
import { createState } from "../create-state";

export const getApolloInspectorStopTracking = (
  set: ISet
): IStopApolloInspectorTracking => {
  const [stopApolloInspectorTracking, setStopApolloInspectorTracking] =
    createState(() => {}, "stopApolloInspectorTracking", set);
  return {
    stopApolloInspectorTracking,
    setStopApolloInspectorTracking,
  };
};
