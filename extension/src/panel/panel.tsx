import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider, theme } from "antd";
import { PanelContainer } from "./panel-container";

const ApolloUIComponent = () => {
  const isLightTheme = false;

  // Mock data is defined but not used since PanelContainer doesn't accept props
  // The component has its own internal state management

  return (
    <ConfigProvider
      theme={{
        algorithm: isLightTheme ? theme.defaultAlgorithm : theme.darkAlgorithm,
        /* token: {
          colorBgContainer: "#141414", // Dark background for containers
          colorText: "rgba(255, 255, 255, 0.85)", // Light text for dark background
          colorBgElevated: "#1f1f1f", // For dropdown menus and popovers
          colorBorder: "#303030", // Border color for tables and dividers
          colorPrimary: "#177ddc", // Primary color for buttons and active states
        }, */
      }}
    >
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "#141414",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        {<PanelContainer />}
        {"Jyoti Prakash"}
      </div>
    </ConfigProvider>
  );
};

const mountElement = document.getElementById("panel");
const root = mountElement && ReactDOM.createRoot(mountElement);
root && root.render(<ApolloUIComponent />);
