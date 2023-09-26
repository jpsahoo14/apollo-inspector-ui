import { gql } from "@apollo/client";

export const users = gql`
  query users {
    users {
      users {
        id
        name
      }
    }
  }
`;
