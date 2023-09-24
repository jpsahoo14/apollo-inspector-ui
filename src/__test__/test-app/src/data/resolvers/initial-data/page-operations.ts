import { pagesArray, createPage, data } from "./initial-data";

export const addPage = () => {
  const page = createPage();
  data.editorData?.pages.push(page);
};

export const removePage = (pageId: number) => {
  const updatedPages =
    data.editorData?.pages.filter((pg) => pg.id != pageId) || [];

  const removedPage = data.editorData?.pages.find((pg) => pg.id == pageId);
  data.editorData = { ...data.editorData, pages: updatedPages } as any;

  return removedPage;
};

export const setSelectedPage = (pageId: number) => {
  const page = pagesArray.find((pg) => pg.id === pageId);
  if (page && data.editorData) {
    data.editorData.selectedPage = page;
    return page;
  }

  throw new Error("page not found");
};
