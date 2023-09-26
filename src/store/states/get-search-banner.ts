import { ISet, ISearchBannerStore } from "../store.interface";
import { createState } from "../create-state";

export const getSearchBannerStore = (set: ISet): ISearchBannerStore => {  
  const [searchBanner, setSearchBanner] = createState(
    { searchText: "", showSearchBanner: false },
    "searchBanner",
    set
  );

  return { searchBanner, setSearchBanner };
};
