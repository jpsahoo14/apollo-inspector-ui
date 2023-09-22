import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { OperationsTrackerContainer } from "./operations-tracker-container";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { EditorMainApp } from "./__test__/test-app/src/components/editor-main-app/editor-main-app";
import { createClient } from "./__test__/test-app/src/data/apollo-client";
import { ApolloProvider } from "@apollo/client";

const apolloClient = createClient();
const apolloUIComponent = (
  <ApolloProvider client={apolloClient}>
    <FluentProvider theme={teamsLightTheme}>
      <EditorMainApp />
      <OperationsTrackerContainer
        apolloClients={{
          ["onenote"]: apolloClient,
          ["test1"]: apolloClient,
          ["test2"]: apolloClient,
        }}
      />
    </FluentProvider>
  </ApolloProvider>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>{apolloUIComponent}</React.StrictMode>
);
