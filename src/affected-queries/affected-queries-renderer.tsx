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
  Subtitle2,
  Divider,
  Subtitle2Stronger,
} from "@fluentui/react-components";
import { AffectedQueriesGridRenderers } from "./affected-queries-grid-renderer";
import { IDueToOperation, IVerboseOperation } from "apollo-inspector";
import { useStyles, IClasses } from "./affected-queries-renderer-styles";
import { Info20Regular } from "@fluentui/react-icons";
import { VerboseOperationView } from "../verbose-operation/verbose-operation-view";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { TrackerStoreContext } from "../store";

export interface IAffectedQueriesRendererProps {
  listOfItems: any[];
  gridItems: IDueToOperation[] | undefined;
  selectedListItem: string;
  onTabSelect: (event: SelectTabEvent, data: SelectTabData) => void;
}

export const AffectedQueriesRenderer = (
  props: IAffectedQueriesRendererProps
) => {
  const { listOfItems } = props;
  const classes = useStyles();

  if (listOfItems.length === 0) {
    return (
      <div className={classes.emptyPage}>
        <Title1>No re-rendered queries</Title1>
      </div>
    );
  }

  return <AffectedQueriesInternal {...props} />;
};

const AffectedQueriesInternal = (props: IAffectedQueriesRendererProps) => {
  const { listOfItems, gridItems, selectedListItem, onTabSelect } = props;
  const classes = useStyles();

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
  const affectedQueriesGridRenderersClasses =
    getAffectedQueriesGridRenderersClasses(
      selectedOperationInAffectedQueriesView,
      classes
    );
  return (
    <div className={classes.rightPane}>
      <div className={classes.rightPaneHeader}>
        <Subtitle2Stronger>
          {`${selectedListItem}                            `}
          <Subtitle2>
            {" query is re-rendered due to following operations in the table"}
          </Subtitle2>
        </Subtitle2Stronger>
      </div>
      <div className={affectedQueriesGridRenderersClasses}>
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
    <div className={classes.verboseOperationViewWrapper}>
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

const getAffectedQueriesGridRenderersClasses = (
  selectedOperationInAffectedQueriesView: IVerboseOperation | null | undefined,
  classes: Record<IClasses, string>
) =>
  selectedOperationInAffectedQueriesView
    ? classes.affectedQueriesGridWrapper
    : mergeClasses(
        classes.affectedQueriesGridWrapper,
        classes.expandToAvailableSpace
      );
