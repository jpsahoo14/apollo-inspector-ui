import { gql } from "@apollo/client";

export const schemaDocumentNode = gql`
  type Query {
    editor(input: EditorInput!): EditorView
    users: UsersPayload!
    refreshUsers: RefreshUsersPayload!
  }

  type Mutation {
    addSection(input: AddSectionInput!): Section!
    removeSection(input: RemoveSectionInput): Section!
    updateSection(input: UpdateSectionInput): Section!

    addPage: Page!
    removePage(input: RemovePageInput): Page!
    updatePageTitle(input: UpdatePageTitleInput): Page!

    setSelectedPage(input: SetSelectedPageInput!): Page
  }

  type UsersPayload {
    users: [User!]!
  }

  type RefreshUsersPayload {
    users: [User!]!
  }

  input SetSelectedPageInput {
    pageId: Int!
  }

  type Subscription {
    editorSync: EditorSyncPayload
  }

  type EditorSyncPayload {
    section: Section
  }

  type EditorView {
    id: Int!
    selectedPage: Page!
    pages: [Page!]!
  }

  type Page {
    id: Int!
    title: String
    lastEditedBy: User
    lastEditTime: String
    sections: [Section!]!
  }

  type Section {
    id: Int!
    title: String
    content: String
    lastEditedBy: User
    isEditing: Boolean!
  }

  type User {
    id: Int!
    name: String
  }

  input EditorInput {
    id: Int
  }

  input RemoveSectionInput {
    pageId: Int
    sectionId: Int
  }

  input UpdateSectionInput {
    title: String
    content: String
  }

  input RemovePageInput {
    id: Int
  }

  input UpdatePageTitleInput {
    title: String
  }

  input AddSectionInput {
    pageId: Int
  }
`;
