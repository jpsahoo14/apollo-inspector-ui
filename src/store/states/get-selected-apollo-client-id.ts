import { ISet, ISelectedApolloClientId } from "../store.interface";
import { createState } from "../create-state";

export const getSelectedApolloClientId = (
  set: ISet
): ISelectedApolloClientId => {
  const [selectedApolloClientIds, setSelectedApolloClientIds] = createState<
    string[]
  >([], "selectedApolloClientIds", set);

  return {
    selectedApolloClientIds,
    setSelectedApolloClientIds,
  };
};
