import { ISet, ISelectedApolloClientId } from "../store.interface";
import { createState } from "../create-state";

export const getSelectedApolloClientId = (
  set: ISet
): ISelectedApolloClientId => {
  const [selectedApolloClientId, setSelectedApolloClientId] = createState(
    "",
    "selectedApolloClientId",
    set
  );

  return { selectedApolloClientId, setSelectedApolloClientId };
};
