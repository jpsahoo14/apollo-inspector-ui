import * as React from "react";
import { Table, Button, Badge } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { OperationStatus } from "apollo-inspector";
import { useStyles, IClasses } from "./data-grid-view.styles";
import { FilterView, IFilterSet } from "./filter-view";
import { IDataGridView } from "./data-grid.interface";
import { ColumnOptions } from "./column-options-view";
import { useDataGridView } from "./use-data-grid-view";
import { Search } from "../search/search";
import { debounce, DebouncedFunc } from "lodash-es";
import {
  OperationReducerActionEnum,
  IOperationsReducerState,
} from "../operations-tracker-container-helper";
import { Resizable } from "react-resizable";

// Resizable Title for column headers
const ResizableTitle = (props: any) => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 8,
            cursor: "col-resize",
            zIndex: 1,
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

export const DataGridView = React.memo((props: IDataGridView) => {
  const classes = useStyles();
  const setSearchText = React.useCallback(
    (text: string) => {
      props.dispatchOperationsState({
        type: OperationReducerActionEnum.UpdateSearchText,
        value: text,
      });
    },
    [props.dispatchOperationsState]
  );

  const {
    handleToggleFilters,
    divRef,
    showFilters,
    updateFilters,
    filters,
    operationsState,
    filteredItems,
    columns,
    onClick,
  } = useDataGridView(props);

  const debouncedFilter = React.useCallback(
    debounce((e: React.SyntheticEvent) => {
      const input = e.target as HTMLInputElement;
      setSearchText(input.value);
    }, 200),
    [setSearchText]
  );

  const [colWidths, setColWidths] = React.useState(() =>
    columns.map((col) => col.width || 180)
  );

  React.useEffect(() => {
    setColWidths(columns.map((col) => col.width || 180));
  }, [columns.length]);

  const handleResize =
    (index: number) =>
    (e: any, { size }: any) => {
      setColWidths((prevWidths) => {
        const next = [...prevWidths];
        next[index] = size.width;
        return next;
      });
    };

  const resizableColumns = columns.map((col, idx) => ({
    ...col,
    width: colWidths[idx],
    onHeaderCell: () => ({
      width: colWidths[idx],
      onResize: handleResize(idx),
    }),
  }));

  // Add ref and state for dynamic height
  const gridWrapperRef = React.useRef<HTMLDivElement>(null);
  const [dynamicGridHeight, setDynamicGridHeight] = React.useState(400);

  // Observe wrapper height
  React.useEffect(() => {
    if (!gridWrapperRef.current) return;
    const handleResize = () => {
      if (gridWrapperRef.current) {
        setDynamicGridHeight(gridWrapperRef.current.offsetHeight);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle row selection
  const onRowClick = (record: any) => {
    onClick(record);
  };

  // Set row class based on selection and status
  const getRowClassName = (record: any, index: number) => {
    const isRowSelected = operationsState.selectedOperation?.id === record.id;
    const isFailed =
      record.status === OperationStatus.Failed ||
      record.status === OperationStatus.PartialSuccess;

    if (isRowSelected && isFailed) {
      return `${classes.selectedRow} ${classes.failedRow}`;
    } else if (isFailed) {
      return classes.failedRow;
    } else if (isRowSelected) {
      return classes.selectedRow;
    } else if (index % 2 !== 0) {
      return classes.gridRowOdd;
    }
    return "";
  };

  return (
    <div style={classes.wholeBody}>
      {renderFilterAndColumnOptionsButton(
        classes,
        handleToggleFilters,
        operationsState,
        debouncedFilter,
        props.operations?.length || 0,
        filters
      )}
      <div style={classes.gridView} ref={divRef}>
        {renderFilterView(
          showFilters,
          classes,
          updateFilters,
          filters,
          operationsState
        )}
        <div
          key="grid-view"
          style={
            operationsState.selectedOperation
              ? classes.selectedOperationGridWrapper
              : classes.gridWrapper
          }
          ref={gridWrapperRef}
        >
          <Table
            components={{
              header: {
                cell: ResizableTitle,
              },
            }}
            dataSource={filteredItems}
            columns={resizableColumns}
            pagination={false}
            size="small"
            bordered
            rowKey="id"
            style={classes.grid}
            scroll={{ y: dynamicGridHeight }}
            onRow={(record) => ({
              onClick: () => onRowClick(record),
            })}
            rowClassName={(record, index) =>
              getRowClassName(record, index) as string
            }
          />
        </div>
      </div>
    </div>
  );
});

const renderFilterAndColumnOptionsButton = (
  classes: IClasses,
  handleToggleFilters: () => void,
  operationsState: IOperationsReducerState,
  debouncedFilter: DebouncedFunc<(e: React.SyntheticEvent) => void>,
  operationsLength: number,
  filters: IFilterSet
) => (
  <div style={classes.headers}>
    <div style={classes.searchBar}>
      <Search onSearchChange={debouncedFilter} />
      {operationsState.searchText && (
        <Badge count={" "} style={classes.searchBadge} />
      )}
    </div>
    <Button
      icon={<FilterOutlined />}
      onClick={handleToggleFilters}
      style={classes.filtersButton}
    >
      Filter
      {(filters.results.length !== 0 ||
        filters.statuses.length !== 0 ||
        filters.types.length !== 0) && (
        <Badge count={" "} style={classes.badge} />
      )}
    </Button>
    {!operationsState.selectedOperation && <ColumnOptions />}
  </div>
);

const renderFilterView = (
  showFilters: boolean,
  classes: IClasses,
  updateFilters: (input: React.SetStateAction<IFilterSet>) => void,
  filters: IFilterSet,
  operationsState: IOperationsReducerState
) =>
  showFilters && (
    <div key="filter-view" style={classes.filterViewWrapper}>
      <FilterView
        setFilters={updateFilters}
        filters={filters}
        operationsState={operationsState}
      />
    </div>
  );

DataGridView.displayName = "DataGridView";
