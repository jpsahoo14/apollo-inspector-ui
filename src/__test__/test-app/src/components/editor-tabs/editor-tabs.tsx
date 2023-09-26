import * as React from "react";
import { useQuery } from "@apollo/client";
import { TabList, Tab } from "@fluentui/react-components";
import { useStyles } from "./editor-tabs.styles";

interface IEditorTabs {
  editorId: number;
  setEditorId: React.Dispatch<React.SetStateAction<number>>;
}
export const EditorTabs = (props: IEditorTabs) => {
  const { setEditorId, editorId } = props;
  const styles = useStyles();

  const onTabSelect = React.useCallback(
    (_, { value }: any) => {
      setEditorId(parseInt(value));
    },
    [setEditorId]
  );

  return (
    <div className={styles.root}>
      <TabList
        onTabSelect={onTabSelect}
        selectedValue={`${editorId}`}
        defaultSelectedValue={`${editorId}`}
      >
        <Tab value="1">Editor One</Tab>
        <Tab value="2">Editor Two</Tab>
        <Tab value="3">Editor Three</Tab>
        <Tab value="4">Users list</Tab>
      </TabList>
    </div>
  );
};
