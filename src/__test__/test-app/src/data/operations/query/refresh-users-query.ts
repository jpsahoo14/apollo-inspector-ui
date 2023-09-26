import { gql } from "@apollo/client";

export const refreshUsers = gql`
  query refreshUsers($input: EditorInput) {
    refreshUsers {
      users {
        id
        name
      }
    }
  }
`;
