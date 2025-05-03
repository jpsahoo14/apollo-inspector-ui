import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { OperationsTrackerContainer } from "./operations-tracker-container";
import { ConfigProvider, theme } from "antd";
import { ErrorBoundary } from "./operation-tracker-error-boundary";
import { IAppProps } from "./operations-tracker-container.interface";
import "antd/dist/reset.css";

export default function App(props: IAppProps) {
  const isLightTheme = false;
  
  return (
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          algorithm: isLightTheme ? theme.defaultAlgorithm : theme.darkAlgorithm,
          token: {
            colorBgContainer: '#141414', // Dark background for containers
            colorText: 'rgba(255, 255, 255, 0.85)', // Light text for dark background
          }
        }}
      >
        <OperationsTrackerContainer {...props} />
      </ConfigProvider>
    </ErrorBoundary>
  );
}

if (import.meta.env.MODE !== "production") {
  const mockProps = {
    apolloClientIds: ["client1", "client2"],
    onRecordStart: () => {},
    onRecordStop: () => {},
    onCopy: () => {},
    shouldStartRecordingOnMount: true,
    // Add sample operation data for development testing
    apollOperationsData: [
      {
        id: "operation1",
        name: "GetUserData",
        type: "query",
        status: "success",
        startTime: Date.now() - 5000,
        endTime: Date.now(),
        duration: 5000,
        variables: { userId: 123 },
        result: { data: { user: { name: "John Doe", email: "john@example.com" } } }
      },
      {
        id: "operation2",
        name: "UpdateProfile",
        type: "mutation",
        status: "error",
        startTime: Date.now() - 8000,
        endTime: Date.now() - 2000,
        duration: 6000,
        variables: { profile: { name: "Jane Doe" } },
        result: { errors: [{ message: "Authentication required" }] }
      }
    ]
  };
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App {...mockProps} />
    </React.StrictMode>
  );
}
