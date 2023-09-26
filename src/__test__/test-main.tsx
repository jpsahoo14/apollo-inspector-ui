import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { OperationsTrackerContainer } from "../operations-tracker-container";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { EditorMainApp } from "./test-app/src/components/editor-main-app/editor-main-app";
import { createClient } from "./test-app/src/data/apollo-client";
import { ApolloProvider } from "@apollo/client";
import { ApolloInspector, IApolloClientObject } from "apollo-inspector";

const apolloClient = createClient();
const onRecordStart = (selectedApolloClientsIds: string[]) => {
  const inspector = new ApolloInspector([
    { cliendId: "client-1", client: apolloClient },
    { cliendId: "client-2", client: apolloClient },
  ]);
  return inspector.startTrackingSubscription({
    tracking: { trackVerboseOperations: true },
    apolloClientIds: selectedApolloClientsIds,
    delayOperationsEmitByInMS: 500,
  });
};

const onStopRecording = () => {};

const apolloUIComponent = (
  <ApolloProvider client={apolloClient}>
    <FluentProvider theme={teamsLightTheme}>
      <EditorMainApp />
      <OperationsTrackerContainer
        apolloClients={[
          { cliendId: "client-1", client: apolloClient },
          { cliendId: "client-2", client: apolloClient },
        ]}
        onCopy={() => {}}
        onRecordStart={onRecordStart}
        onRecordStop={onStopRecording}
      />
    </FluentProvider>
  </ApolloProvider>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>{apolloUIComponent}</React.StrictMode>
);
