import { removeSection } from "../initial-data";

export const removeSectionResolver = (_, { input }) => {
  const { pageId, sectionId } = input;
  const section = removeSection({ pageId, sectionId });

  return section;
};
