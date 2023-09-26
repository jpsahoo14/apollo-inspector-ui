import { refreshUsers as refresh } from "../initial-data";

export const refreshUsers = (_: any) => {
  const result = { users: refresh(), __typename: "RefreshUsersPayload" };
  return result;
};
