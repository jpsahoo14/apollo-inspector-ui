import { gql } from "@apollo/client";

export const editorQuery = gql`
  query editor($input: EditorInput) {
    editor(input: $input) {
      id
      selectedPage {
        id
        title
        sections {
          id
          title
          content
        }
      }
      pages {
        id
        title
        sections {
          id
          title
          content
        }
      }
    }
  }
`;
