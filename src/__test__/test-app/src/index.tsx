import * as React from "react";
import * as ReactDom from "react-dom";
import { FluentProvider, teamsDarkTheme } from "@fluentui/react-components";
import { createClient } from "./data/apollo-client";
import { ApolloProvider, useApolloClient, useQuery } from "@apollo/client";
import { editorQuery, addSectionMutation } from "./data/operations";
import { EditorMainApp } from "./components/editor-main-app/editor-main-app";

const apolloClient = createClient();

ReactDom.render(
  <ApolloProvider client={apolloClient}>
    <FluentProvider theme={teamsDarkTheme}>
      <EditorMainApp />
    </FluentProvider>
  </ApolloProvider>,
  document.getElementById("app")
);
