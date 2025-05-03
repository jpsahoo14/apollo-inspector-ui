import * as React from "react";
import { useStyles } from "./page-navigator-list-container.styles";
import { Button, List, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PageContainer } from "../page/page-container";

const { Text } = Typography;

// Create a default user object for pages
const defaultUser = { id: 1, name: "Default User" };

export interface IPageNavigatorListProps {
  pages: Array<{
    id: string | number;
    title?: string;
    sections: Array<{
      id: string | number;
      title?: string;
    }>;
  }>;
  activePage: {
    id: string | number;
    title?: string;
    sections: Array<{
      id: string | number;
      title?: string;
    }>;
  } | null;
  setActivePage: (page: any) => void;
}

export const PageNavigatorList = (props: IPageNavigatorListProps) => {
  const { pages, activePage, setActivePage } = props;
  const classes = useStyles();

  const onPageClick = React.useCallback(
    (page: any) => {
      setActivePage(page);
    },
    [setActivePage]
  );

  return (
    <div style={classes.root}>
      <div style={classes.header}>
        <Text strong>Files</Text>
        <Button 
          icon={<PlusOutlined />} 
          size="small" 
          onClick={() => {
            // Handle new page creation if needed
            console.log('Create new page');
          }}
        >
          New
        </Button>
      </div>
      <div style={classes.list}>
        <List
          dataSource={pages}
          renderItem={(page) => (
            <List.Item>
              <PageContainer
                page={{
                  ...page,
                  id: Number(page.id), // Convert to number as IPage expects number
                  title: page.title || "Untitled",
                  lastEditedBy: defaultUser,
                  isEditing: false,
                  sections: page.sections.map(section => ({
                    ...section,
                    id: Number(section.id),
                    title: section.title || "Untitled Section",
                    content: "",
                    lastEditedBy: defaultUser,
                    isEditing: false
                  }))
                }}
                isActive={activePage ? activePage.id === page.id : false}
                onClick={() => onPageClick(page)}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};
