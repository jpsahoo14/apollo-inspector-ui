import { gql } from "@apollo/client";

export const setSelectedPageMutation = gql`
  mutation setSelectedPage($input: SetSelectedPageInput) {
    setSelectedPage(input: $input) {
      id
      title
      sections {
        id
        title
        content
      }
    }
  }
`;
