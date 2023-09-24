import { usersArray } from "./initial-data";
import { cloneDeep } from "lodash-es";
import { faker } from "@faker-js/faker";

export const getUsers = () => {
  return cloneDeep(usersArray);
};

export const refreshUsers = () => {
  const modifiedUsers = usersArray.map((user) => ({
    ...user,
    name: faker.person.firstName(),
  }));
  return cloneDeep(modifiedUsers);
};
