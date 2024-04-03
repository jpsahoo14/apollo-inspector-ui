import React from "react";
import ReactDOM from "react-dom/client";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from "@fluentui/react-components";
import { PanelContainer } from "./panel-container";

const ApolloUIComponent = () => {
  const isLightTheme = false;

  return (
    <FluentProvider
      theme={isLightTheme ? webLightTheme : webDarkTheme}
      style={{ width: "100%" }}
    >
      <PanelContainer />
    </FluentProvider>
  );
};

const mountElement = document.getElementById("panel");
const root = mountElement && ReactDOM.createRoot(mountElement);
root && root.render(<ApolloUIComponent />);
