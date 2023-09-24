import { refreshUsers as refresh } from "../initial-data";

export const refreshUsers = (_: any) => {
  const result = { users: refresh(), __typename: "RefreshUsersPayload" };
  console.log({ refreshUsersResult: result });
  return result;
};
