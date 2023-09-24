import { setSelectedPage } from "../initial-data";

export const setSelectedPageResolver = (_, { input }) => {
  const { pageId } = input;

  return setSelectedPage(pageId);
};
