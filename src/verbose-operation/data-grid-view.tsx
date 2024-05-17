import * as React from "react";
import {
  DataGridBody,
  DataGrid,
  DataGridRow,
  DataGridHeader,
  DataGridCell,
  DataGridHeaderCell,
} from "@fluentui-contrib/react-data-grid-react-window";
import { IVerboseOperation, OperationStatus } from "apollo-inspector";
import { useStyles, IClasses } from "./data-grid-view.styles";
import { FilterView, IFilterSet } from "./filter-view";
import { Item, IDataGridView } from "./data-grid.interface";
import { Filter20Filled } from "@fluentui/react-icons";
import { ColumnOptions } from "./column-options-view";
import { Badge, Button, mergeClasses } from "@fluentui/react-components";
import { useDataGridView } from "./use-data-grid-view";
import { IOperationsReducerState } from "../operations-tracker-container-helper";
import { Search } from "../search/search";
import { debounce, DebouncedFunc } from "lodash-es";
import { OperationReducerActionEnum } from "../operations-tracker-container-helper";

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
    gridHeight,
    handleToggleFilters,
    divRef,
    showFilters,
    updateFilters,
    filters,
    operationsState,
    filteredItems,
    columns,
    columnSizing,
    updateVerboseOperations,
    onClick,
  } = useDataGridView(props);

  const debouncedFilter = React.useCallback(
    debounce((e: React.SyntheticEvent) => {
      const input = e.target as HTMLInputElement;
      setSearchText(input.value);
    }, 200),
    [setSearchText]
  );

  return (
    <div className={classes.wholeBody}>
      {renderFilterAndColumnOptionsButton(
        classes,
        handleToggleFilters,
        operationsState,
        debouncedFilter,
        props.operations?.length || 0,
        filters
      )}
      <div className={classes.gridView} ref={divRef}>
        {renderFilterView(
          showFilters,
          classes,
          updateFilters,
          filters,
          operationsState
        )}
        <div
          key="grid-view"
          {...(operationsState.selectedOperation
            ? { className: classes.selectedOperationGridWrapper }
            : { className: classes.gridWrapper })}
        >
          <DataGrid
            items={filteredItems as any}
            columns={columns}
            focusMode="cell"
            sortable
            resizableColumns
            selectionAppearance="brand"
            columnSizingOptions={columnSizing}
            onSelectionChange={updateVerboseOperations as any}
            className={classes.grid}
          >
            <DataGridHeader>
              <DataGridRow>
                {({ renderHeaderCell }) => (
                  <DataGridHeaderCell className={classes.gridHeaderCell}>
                    {renderHeaderCell()}
                  </DataGridHeaderCell>
                )}
              </DataGridRow>
            </DataGridHeader>
            <DataGridBody<IVerboseOperation>
              className={classes.gridBody}
              itemSize={40}
              height={gridHeight}
            >
              {({ item, rowId }, style) => {
                const isRowSelected =
                  operationsState.selectedOperation?.id === (item as Item).id;
                const isFailed =
                  (item as Item).status === OperationStatus.Failed ||
                  (item as Item).status === OperationStatus.PartialSuccess;

                const rowClassName =
                  isRowSelected && isFailed
                    ? mergeClasses(classes.selectedRow, classes.failedRow)
                    : isFailed
                      ? classes.failedRow
                      : isRowSelected
                        ? classes.selectedRow
                        : Number(rowId) % 2 !== 0
                          ? classes.gridRowOdd
                          : undefined;

                return (
                  <DataGridRow<Item>
                    key={rowId}
                    style={style as React.CSSProperties}
                    className={rowClassName}
                  >
                    {({ renderCell }) => {
                      const cb = () => onClick(item);
                      return (
                        <DataGridCell
                          className={classes.gridrowcell}
                          onClick={cb}
                        >
                          {renderCell(item as Item)}
                        </DataGridCell>
                      );
                    }}
                  </DataGridRow>
                );
              }}
            </DataGridBody>
          </DataGrid>
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
  <div className={classes.headers}>
    <div className={classes.searchBar}>
      <Search onSearchChange={debouncedFilter} />
      {operationsState.searchText && (
        <Badge size="extra-small" className={classes.searchBadge} />
      )}
    </div>
    <Button
      icon={<Filter20Filled />}
      onClick={handleToggleFilters}
      className={classes.filtersButton}
    >
      Filter
      {(filters.results.length !== 0 ||
        filters.statuses.length !== 0 ||
        filters.types.length !== 0) && (
        <Badge size="extra-small" className={classes.badge} />
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
    <div key="filter-view" className={classes.filterViewWrapper}>
      <FilterView
        setFilters={updateFilters}
        filters={filters}
        operationsState={operationsState}
      />
    </div>
  );

DataGridView.displayName = "DataGridView";
