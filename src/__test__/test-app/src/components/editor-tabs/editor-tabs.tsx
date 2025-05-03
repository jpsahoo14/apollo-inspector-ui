import * as React from "react";
import { Tabs } from "antd";
import { useStyles } from "./editor-tabs.styles";

export interface IEditorTabsProps {
  tabs: {
    id: string;
    text: string;
  }[];
  selectedTab: string;
  setSelectedTab: (tabId: string) => void;
}

export const EditorTabs = (props: IEditorTabsProps) => {
  const { tabs, selectedTab, setSelectedTab } = props;
  const classes = useStyles();
  
  const items = tabs.map(tab => ({
    key: tab.id,
    label: tab.text
  }));
  
  return (
    <div className={classes.root}>
      <Tabs 
        activeKey={selectedTab} 
        onChange={setSelectedTab} 
        items={items}
      />
    </div>
  );
};
