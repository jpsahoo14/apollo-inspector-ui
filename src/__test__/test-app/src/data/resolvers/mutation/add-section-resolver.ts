import { addSectionToPage } from "../initial-data";
export const addSection = (
  _: any,
  { input }: { input: { pageId: number } }
) => {
  const random = getRandomInt(10);
  if (random % 2 === 0) {
    throw new Error("failed to create new section");
  }
  return addSectionToPage(input);
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
