import * as React from "react";
import {
  DataGridBody,
  DataGrid,
  DataGridRow,
  DataGridHeader,
  DataGridCell,
  DataGridHeaderCell,
} from "@fluentui-contrib/react-data-grid-react-window";
import { IVerboseOperation } from "apollo-inspector";
import { useStyles, IClasses } from "./data-grid-view.styles";
import { FilterView, IFilterSet } from "./filter-view";
import { Item, IDataGridView } from "./data-grid.interface";
import { LineHorizontal3Regular } from "@fluentui/react-icons";
import { ColumnOptions } from "./column-options-view";
import { Button } from "@fluentui/react-components";
import { useDataGridView } from "./use-data-grid-view";
import { IOperationsReducerState } from "../operations-tracker-container-helper";
import { Dismiss16Filled } from "@fluentui/react-icons";

export const DataGridView = (props: IDataGridView) => {
  const classes = useStyles();
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
    scrollbarWidth,
    onClick,
  } = useDataGridView(props);

  return (
    <div className={classes.wholeBody}>
      {renderFilterAndColumnOptionsButton(classes, handleToggleFilters, filters, updateFilters)}
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
            selectionMode="multiselect"
            onSelectionChange={updateVerboseOperations as any}
            className={classes.grid}
          >
            <DataGridHeader
              style={{
                paddingRight: scrollbarWidth,
                backgroundColor: "#d4e8fa",
              }}
            >
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
                const isFailed = (item as Item).status
                  .toLowerCase()
                  .includes("failed");
                const rowClassName =
                  isRowSelected && isFailed
                    ? classes.selectedAndFailedRow
                    : isFailed
                      ? classes.failedRow
                      : isRowSelected
                        ? classes.selectedRow
                        : classes.gridRow;

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
                          // className={classes.gridrowcell}
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
};

const renderFilterAndColumnOptionsButton = (
  classes: IClasses,
  handleToggleFilters: () => void,
  filters: IFilterSet,
  updateFilters: (input: React.SetStateAction<IFilterSet>) => void,
) => {
  const handleCrossButtonClick = (event: any) =>{
    const selectedTypeName = event.currentTarget.name;
    updateFilters((prevState: IFilterSet) => {
      const arr = prevState.types.filter(type => type !== selectedTypeName);
      return {
        ...prevState,
        types: arr,
      };
    });
  }
  

  return (
    <div className={classes.headers}>
      <Button icon={<LineHorizontal3Regular />} onClick={handleToggleFilters}>
        Filters
      </Button>
      <ColumnOptions />
      <div>
        {filters.types.map((type, index) => (
          <Button
            shape="circular"
            key={index}
            icon={<Dismiss16Filled />}
            iconPosition="after"
            name = {type}
            onClick={(e) => handleCrossButtonClick(e)}
          >
            {type}
          </Button>
        ))}
      </div>
    </div>
  );
}


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
