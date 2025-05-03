import { useQuery } from "@apollo/client";
import React from "react";
import { editorQuery } from "../../data/operations";
import { useStyles } from "./editor-main-app.styles";
import { Typography, Divider, Spin, Button } from "antd";
import { Page } from "../../types";
import { ViewSection } from "../section/view-section";
import { PageNavigatorList } from "../page-navigator-list/page-navigator-list-container";

const { Text } = Typography;

export const EditorMainApp = () => {
  const classes = useStyles();
  const { loading, error, data, refetch } = useQuery(editorQuery, {
    variables: { input: { id: 1 } },
  });
  const [files, setFiles] = React.useState<Page[]>([]);
  const [activePage, setActivePage] = React.useState<Page | null>(null);

  React.useEffect(() => {
    if (data?.editor?.pages) {
      setFiles(data.editor.pages);
    }

    if (data?.editor?.selectedPage) {
      setActivePage(data.editor.selectedPage);
    }
  }, [data]);

  if (loading) {
    return (
      <div style={classes.root}>
        <div style={classes.body}>
          <div style={classes.bodyContent}>
            <Text>Loading data</Text>
            <Spin />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={classes.root}>
        <div style={classes.body}>
          <div style={classes.bodyContent}>
            <Text>Error trying to load data</Text>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={classes.root}>
      <div style={classes.body}>
        <PageNavigatorList
          pages={files}
          activePage={activePage}
          setActivePage={setActivePage}
        />
        <Divider type="vertical" style={{ height: "100%" }} />
        <div style={classes.bodyContent}>
          {activePage ? (
            <div style={classes.visibleContent}>
              {activePage.sections.map((section, index) => {
                // Create empty tabs array since it's required by ViewSection
                const emptyTabs = [{ id: `tab-${index}`, text: "Default" }];

                return (
                  <ViewSection
                    key={`${section.id}-${index}`}
                    title={section.title || `Section ${index + 1}`}
                    id={String(section.id)}
                    tabs={emptyTabs}
                    defaultTab={emptyTabs[0].id}
                  />
                );
              })}
            </div>
          ) : (
            <div style={classes.welcomePanel}>
              <Text>Welcome to the editor</Text>
              <Text>Select a file to start editing</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
