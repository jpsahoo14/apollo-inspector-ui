import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { OperationsTrackerContainer } from "./operations-tracker-container";
import { FluentProvider, webLightTheme, webDarkTheme } from "@fluentui/react-components";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FluentProvider theme={webDarkTheme}>
      <OperationsTrackerContainer />
    </FluentProvider>
  </React.StrictMode>
);
