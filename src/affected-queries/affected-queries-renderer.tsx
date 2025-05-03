import * as React from "react";
import { Tabs, Button, Tooltip, Typography, Divider } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { AffectedQueriesGridRenderers } from "./affected-queries-grid-renderer";
import { IDueToOperation, IVerboseOperation } from "apollo-inspector";
import { useStyles, IClasses } from "./affected-queries-renderer-styles";
import { VerboseOperationView } from "../verbose-operation/verbose-operation-view";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { TrackerStoreContext } from "../store";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export interface IAffectedQueriesRendererProps {
  listOfItems: any[];
  gridItems: IDueToOperation[] | undefined;
  selectedListItem: string;
  onTabSelect: (activeKey: string) => void;
}

export const AffectedQueriesRenderer = (
  props: IAffectedQueriesRendererProps
) => {
  const { listOfItems } = props;
  const classes = useStyles();

  if (listOfItems.length === 0) {
    return (
      <div style={classes.emptyPage}>
        <Title level={1}>No re-rendered queries</Title>
      </div>
    );
  }

  return <AffectedQueriesInternal {...props} />;
};

const AffectedQueriesInternal = (props: IAffectedQueriesRendererProps) => {
  const { listOfItems, gridItems, selectedListItem, onTabSelect } = props;
  const classes = useStyles();

  return (
    <div style={classes.root}>
      {renderLeftPane(classes, selectedListItem, onTabSelect, listOfItems)}
      <Divider type="vertical" style={{ ...classes.divider, height: "100%" }} />
      {renderRightPane(classes, selectedListItem, gridItems)}
    </div>
  );
};

const renderRightPane = (
  classes: Record<IClasses, string>,
  selectedListItem: string,
  gridItems: IDueToOperation[] | undefined
) => {
  const onSelectGridCell = useOnSelectGridCell();
  const store = React.useContext(TrackerStoreContext);
  const { selectedOperationInAffectedQueriesView } = useStore(
    store,
    useShallow((store) => ({
      selectedOperationInAffectedQueriesView:
        store.selectedOperationInAffectedQueriesView,
    }))
  );
  const affectedQueriesGridRenderersClasses = selectedOperationInAffectedQueriesView
    ? classes.affectedQueriesGridWrapper
    : `${classes.affectedQueriesGridWrapper} ${classes.expandToAvailableSpace}`;
  
  return (
    <div style={classes.rightPane}>
      <div style={classes.rightPaneHeader}>
        <Text strong>
          {`${selectedListItem} query is re-rendered due to following operations in the table`}
        </Text>
      </div>
      <div style={classes.affectedQueriesGridWrapper}>
        <AffectedQueriesGridRenderers
          items={gridItems}
          onSelectGridCell={onSelectGridCell}
        />
        {renderVerboseOperationView(classes)}
      </div>
    </div>
  );
};

const renderVerboseOperationView = (classes: Record<IClasses, string>) => {
  const store = React.useContext(TrackerStoreContext);
  const {
    selectedOperationInAffectedQueriesView,
    setSelectedOperationInAffectedQueriesView,
  } = useStore(
    store,
    useShallow((store) => ({
      selectedOperationInAffectedQueriesView:
        store.selectedOperationInAffectedQueriesView,
      setSelectedOperationInAffectedQueriesView:
        store.setSelectedOperationInAffectedQueriesView,
    }))
  );

  const closeVerboseOperationView = React.useCallback(() => {
    setSelectedOperationInAffectedQueriesView(null);
  }, [setSelectedOperationInAffectedQueriesView]);

  if (!selectedOperationInAffectedQueriesView) {
    return null;
  }

  return (
    <div style={classes.verboseOperationViewWrapper}>
      <VerboseOperationView
        operation={selectedOperationInAffectedQueriesView}
        closeVerboseOperationView={closeVerboseOperationView}
      />
    </div>
  );
};

const renderLeftPane = (
  classes: Record<IClasses, string>,
  selectedListItem: string,
  onTabSelect: (activeKey: string) => void,
  listOfItems: any[]
) => {
  const items = listOfItems.map(item => ({
    key: item.name,
    label: item.value,
    className: selectedListItem === item.name ? classes.selectedTab : classes.tabListItem
  }));

  return (
    <div style={classes.leftPane}>
      <div style={classes.leftPaneHeader}>
        <Text strong>Re-rendered Queries</Text>
        <Tooltip title="Re-rendered Queries tab helps you see which watch queries were re-rendered and why. It shows insights into the queries and the operations causing those updates.">
          <Button 
            icon={<InfoCircleOutlined />} 
            style={classes.infoButton} 
            type="text"
          />
        </Tooltip>
      </div>
      <Tabs
        activeKey={selectedListItem}
        onChange={onTabSelect}
        tabPosition="left"
        tabBarStyle={{ height: "100%" }}
        items={items}
      />
    </div>
  );
};

const useOnSelectGridCell = () => {
  const store = React.useContext(TrackerStoreContext);
  const { apolloOperationsData, setSelectedOperationInAffectedQueriesView } =
    useStore(
      store,
      useShallow((store) => ({
        apolloOperationsData: store.apolloOperationsData,
        setSelectedOperationInAffectedQueriesView:
          store.setSelectedOperationInAffectedQueriesView,
      }))
    );

  const onSelectGridCell = React.useCallback(
    (item: IDueToOperation) => {
      const operation = apolloOperationsData?.operations?.find(
        (op) => op.id === item.id
      );
      setSelectedOperationInAffectedQueriesView(operation);
    },
    [apolloOperationsData, setSelectedOperationInAffectedQueriesView]
  );
  return onSelectGridCell;
};
