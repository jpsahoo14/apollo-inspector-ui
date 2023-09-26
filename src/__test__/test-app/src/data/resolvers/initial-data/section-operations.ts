import { IPage } from "./data.interface";
import { pagesArray, createSection, data } from "./initial-data";

export const addSectionToPage = (input: { pageId: number }) => {
  const { pageId } = input;

  const page = pagesArray.find((pg) => pg.id === pageId);
  const section = createSection();
  page?.sections.push(section);

  return section;
};

export const removeSection = ({
  pageId,
  sectionId,
}: {
  pageId: number;
  sectionId: number;
}) => {
  const page: IPage = data.editorData?.pages.find(
    (pg) => pg.id === pageId
  ) as IPage;

  const updatedSection = page?.sections.filter((sec) => sec.id == sectionId);
  const removedSection = page?.sections.find((sec) => sec.id == sectionId);

  page.sections = updatedSection;

  return removedSection;
};
