import { removePage } from "../initial-data";

export const removePageResolver = (_, { input }) => {
  const { id } = input;
  const page = removePage(id);

  return page;
};
