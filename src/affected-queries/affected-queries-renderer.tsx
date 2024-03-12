import * as React from "react";
import {
  TabList,
  Tab,
  SelectTabEvent,
  SelectTabData,
  Text,
  Button,
  Tooltip,
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
  const [isInfoTooltipVisible, setInfoTooltipVisible] = React.useState(false);
  const classes = useStyles();
  const tabItems = listOfItems.map((element: any) => {
    return (
      <Tab key={element.name} value={element.name} className={selectedListItem === element.name ? classes.selectedTab : ''} >
        {element.value}
      </Tab>
    );
  });
  return (
    <div className={classes.root}>
      <div className={classes.leftPane}>
          <div className={classes.leftPaneHeader}>
        <Text weight="bold" size={300}><b>Re-rendered Queries</b></Text>
        <Tooltip
              content="Affected Queries tab helps you see which watch queries were re-rendered and why. It shows insights into the queries and the operations causing those updates."
              visible={isInfoTooltipVisible} relationship={"label"} positioning={'after'}>
        <Button
          title="Information"
          tabIndex={0}
          className={classes.infoButton}
          onClick={() => {
            setInfoTooltipVisible(!isInfoTooltipVisible)}}>
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
      <div className={classes.rightPane}>
        <div className={classes.rightPaneHeader}>
          <Text size={300}><b>{selectedListItem}</b> is re-rendered due to following operations in the table</Text>
        </div>
        <AffectedQueriesGridRenderers items={gridItems} />
      </div>
    </div>
  );
};
