import * as React from "react";
import {
  TabList,
  Tab,
  SelectTabEvent,
  SelectTabData,
  Text,
  Button,
  Tooltip,
  Title1,
  mergeClasses,
  Subtitle2Stronger,
  Subtitle2,
  Divider,
} from "@fluentui/react-components";
import { AffectedQueriesGridRenderers } from "./affected-queries-grid-renderer";
import { IDueToOperation } from "apollo-inspector";
import { useStyles } from "./affected-queries-renderer-styles";
import { Info20Regular } from "@fluentui/react-icons";

export interface IAffectedQueriesRendererProps {
  listOfItems: any[];
  gridItems: IDueToOperation[] | undefined;
  selectedListItem: string;
  onTabSelect: (event: SelectTabEvent, data: SelectTabData) => void;
}

export const AffectedQueriesRenderer = (
  props: IAffectedQueriesRendererProps
) => {
  const { listOfItems, gridItems, selectedListItem, onTabSelect } = props;
  const classes = useStyles();

  if (listOfItems.length === 0) {
    return (
      <>
        <Title1>Nothing to show here</Title1>
      </>
    );
  }

  const tabItems = listOfItems.map((element: any) => {
    const tabItemClasses = mergeClasses(
      selectedListItem === element.name ? classes.selectedTab : undefined,
      classes.tabListItem
    );
    return (
      <Tab key={element.name} value={element.name} className={tabItemClasses}>
        {element.value}
      </Tab>
    );
  });
  return (
    <div className={classes.root}>
      {renderLeftPane(classes, selectedListItem, onTabSelect, tabItems)}
      <Divider
        vertical
        style={{ height: "100%" }}
        className={classes.divider}
      />
      {renderRightPane(classes, selectedListItem, gridItems)}
    </div>
  );
};

const renderRightPane = (
  classes: Record<
    | "root"
    | "selectedTab"
    | "infoButton"
    | "leftPaneHeader"
    | "leftPane"
    | "rightPane"
    | "rightPaneHeader"
    | "tabListItem",
    string
  >,
  selectedListItem: string,
  gridItems: IDueToOperation[] | undefined
) => (
  <div className={classes.rightPane}>
    <div className={classes.rightPaneHeader}>
      <Subtitle2Stronger>
        {`${selectedListItem}                            `}
        <Subtitle2>
          {" query is re-rendered due to following operations in the table"}
        </Subtitle2>
      </Subtitle2Stronger>
    </div>
    <AffectedQueriesGridRenderers items={gridItems} />
  </div>
);

const renderLeftPane = (
  classes: Record<
    | "root"
    | "leftPaneHeader"
    | "leftPane"
    | "infoButton"
    | "rightPane"
    | "rightPaneHeader"
    | "selectedTab"
    | "tabListItem"
    | "divider"
    | "leftPaneWrapper",
    string
  >,
  selectedListItem: string,
  onTabSelect: (event: SelectTabEvent, data: SelectTabData) => void,
  tabItems: React.JSX.Element[]
) => (
  <div className={classes.leftPane}>
    <div className={classes.leftPaneHeader}>
      <Text weight="bold" size={300}>
        <b>Re-rendered Queries</b>
      </Text>
      <Tooltip
        content="Affected Queries tab helps you see which watch queries were re-rendered and why. It shows insights into the queries and the operations causing those updates."
        relationship={"label"}
        positioning={"after"}
      >
        <Button className={classes.infoButton}>
          <Info20Regular />
        </Button>
      </Tooltip>
    </div>
    <TabList
      selectedValue={selectedListItem}
      onTabSelect={onTabSelect}
      vertical={true}
    >
      {tabItems}
    </TabList>
  </div>
);
