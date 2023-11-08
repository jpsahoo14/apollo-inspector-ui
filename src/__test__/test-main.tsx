import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { OperationsTrackerContainer } from "../operations-tracker-container";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { EditorMainApp } from "./test-app/src/components/editor-main-app/editor-main-app";
import { createClient } from "./test-app/src/data/apollo-client";
import { ApolloProvider } from "@apollo/client";
import { ApolloInspector } from "apollo-inspector";

const apolloClient = createClient();
const apolloClients = [
  { clientId: "mainClient", client: apolloClient },
  { clientId: "userClient", client: apolloClient },
  { clientId: "userClient-1", client: apolloClient },
  { clientId: "userClient-2", client: apolloClient },
  { clientId: "userClient-3", client: apolloClient },
  { clientId: "userClient-4", client: apolloClient },
  { clientId: "userClient-5", client: apolloClient },
  { clientId: "userClient-6", client: apolloClient },
  { clientId: "userClient-7", client: apolloClient },
  { clientId: "userClient-8", client: apolloClient },
  { clientId: "userClient-9", client: apolloClient },
  { clientId: "userClient-10", client: apolloClient },
];
const onRecordStart = (selectedApolloClientsIds: string[]) => {
  const inspector = new ApolloInspector(apolloClients);
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
        apolloClientIds={apolloClients.map((ac) => ac.clientId)}
        onCopy={(...args) => {
          console.log(`jps onCopy args`, { args });
        }}
        onRecordStart={onRecordStart}
        onRecordStop={onStopRecording}
      />
    </FluentProvider>
  </ApolloProvider>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>{apolloUIComponent}</React.StrictMode>
);
