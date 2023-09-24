import { getUsers } from "../initial-data";

export const users = (_: any) => {
  const usersPayload = {
    users: getUsers().map((user) => ({ ...user, __typename: "User" })),
    __typename: "UsersPayload",
  };
  return usersPayload;
};
