import { IPage, ISection, IUser, IData } from "./data.interface";
import { faker } from "@faker-js/faker";

export const data: IData = {};

let lastCreatedSection = -1;
let lastCreatedPage = -1;
let lastCreatedUser = -1;
export const usersArray: IUser[] = [];
export const pagesArray: IPage[] = [];
export const sectionsArray: ISection[] = [];

export const createSection = (): ISection => {
  const userId = getRandomNumber(0, lastCreatedUser);
  const section = {
    id: ++lastCreatedSection,
    title: faker.word.words(),
    content: faker.lorem.paragraph(3),
    lastEditedBy: usersArray[userId],
    isEditing: false,
  };
  sectionsArray.push(section);
  return section;
};

export const createPage = (): IPage => {
  const numberOfSections = getRandomNumber(1, 10);
  const createdSections = [];
  for (let i = 0; i < numberOfSections; i++) {
    const sections = createSection();
    createdSections.push(sections);
  }

  const page: IPage = {
    id: ++lastCreatedPage,
    title: faker.word.words(),
    sections: createdSections,
    isEditing: false,
    lastEditedBy: usersArray[getRandomNumber(0, lastCreatedUser)],
  };

  return page;
};

const createUser = (): IUser => {
  const user: IUser = { id: ++lastCreatedUser, name: faker.person.firstName() };

  return user;
};

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const createEditorData = () => {
  const numberOfUsers = getRandomNumber(10, 30);
  for (let i = 0; i < numberOfUsers; i++) {
    const user = createUser();
    usersArray.push(user);
  }

  const numberOfPages = getRandomNumber(5, 15);

  for (let i = 0; i < numberOfPages; i++) {
    const page = createPage();
    pagesArray.push(page);
  }

  data.editorData = {
    id: 1,
    selectedPage: pagesArray[0],
    pages: pagesArray,
  };
};

createEditorData();
