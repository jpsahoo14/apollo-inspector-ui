import React from "react";
import ReactDOM from "react-dom";
import { ConfigProvider, theme } from "antd";
import { App } from "./App";
import "antd/dist/reset.css";

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
