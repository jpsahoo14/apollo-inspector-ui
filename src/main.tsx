import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { OperationsTrackerContainer } from "./operations-tracker-container";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FluentProvider theme={teamsLightTheme}>
      <OperationsTrackerContainer />
    </FluentProvider>
  </React.StrictMode>
);
