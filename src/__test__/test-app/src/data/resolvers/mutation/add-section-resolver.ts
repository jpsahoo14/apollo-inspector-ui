import { addSectionToPage } from "../initial-data";
export const addSection = (
  _: any,
  { input }: { input: { pageId: number } }
) => {
  return addSectionToPage(input);
};
