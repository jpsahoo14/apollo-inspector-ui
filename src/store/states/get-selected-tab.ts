import { ISet, ISelectedTabStore } from "../store.interface";
import { createState } from "../create-state";
import { TabHeaders } from "apollo-inspector";

export const getSelectedTabStore = (set: ISet): ISelectedTabStore => {
  const [selectedTab, setSelectedTab] = createState(TabHeaders.VerboseOperationView, "selectedTab", set);
  return {
    selectedTab,
    setSelectedTab,
  };
};
