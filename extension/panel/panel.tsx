import React from "react";
import ReactDOM from "react-dom/client";
import { FluentProvider, webLightTheme, webDarkTheme } from "@fluentui/react-components";
import { PanelContainer } from "./panel-container";

const themeMap = {
  light: webLightTheme,
  dark: webDarkTheme,
};

const ApolloUIComponent = ()=>{
  return (
    <FluentProvider theme={themeMap['light']} style={{ width: "100%" }}>
      <PanelContainer />
    </FluentProvider>
  );
};

const mountElement = document.getElementById("panel");
const root = mountElement && ReactDOM.createRoot(mountElement);
//root && root.render(<React.StrictMode>{apolloUIComponent}</React.StrictMode>);
root && root.render(<ApolloUIComponent />);
