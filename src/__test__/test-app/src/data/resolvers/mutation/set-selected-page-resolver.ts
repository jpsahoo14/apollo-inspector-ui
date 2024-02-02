import { setSelectedPage } from "../initial-data";

export const setSelectedPageResolver = (_, { input }) => {
  const { pageId } = input;
  const random = getRandomInt(10);
  if (random % 2 === 0) {
    throw new Error("failed to set selected page");
  }
  return setSelectedPage(pageId);
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
