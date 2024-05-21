import { gql } from "@apollo/client";

export const addSectionMutation = gql`
  mutation addSection($input: AddSectionInput) {
    addSection(input: $input) {
      id
      title
      content
    }
  }
`;
