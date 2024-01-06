import React from "react";
import ReactDOM from "react-dom/client";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { PanelContainer } from "./panel-container";

const apolloUIComponent = (
  <FluentProvider theme={teamsLightTheme} style={{ width: "100%" }}>
    <PanelContainer />
  </FluentProvider>
);

const mountElement = document.getElementById("panel");
const root = mountElement && ReactDOM.createRoot(mountElement);
//root && root.render(<React.StrictMode>{apolloUIComponent}</React.StrictMode>);
root && root.render(apolloUIComponent);
