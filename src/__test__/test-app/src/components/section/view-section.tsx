import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

// Define IQueryTab interface here since it can't be imported
export interface IQueryTab {
  id: string;
  text: string;
}

export function ViewSection(props: {
  id: string;
  title: string;
  tabs: IQueryTab[];
  defaultTab?: string;
}) {
  const { title, tabs, defaultTab } = props;
  // Initialize with default tab or first tab, but don't track state since it's not used
  const activeTab = defaultTab || (tabs.length > 0 ? tabs[0].id : "");

  return (
    <>
      <div>
        <Text strong>{title}</Text>
      </div>
    </>
  );
}
