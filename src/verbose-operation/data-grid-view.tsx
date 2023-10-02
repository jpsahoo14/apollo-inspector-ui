import * as React from "react";
import { useScrollbarWidth, useFluent } from "@fluentui/react-components";
import {
  DataGridBody,
  DataGrid,
  DataGridRow,
  DataGridHeader,
  DataGridCell,
  DataGridHeaderCell,
} from "@fluentui/react-data-grid-react-window";
import { IVerboseOperation } from "apollo-inspector";
import { useStyles } from "./data-grid-view.styles";
import {
  ICountReducerAction,
  CountReducerActionEnum,
} from "../operations-tracker-body";
import { FilterView, IFilterSet } from "./filter-view";
import { debounce } from "lodash-es";
import { columnSizingOptions, getColumns, getFilteredItems, Item } from "./data-grid-view-helper";
import {
  IOperationsAction,
  IOperationsReducerState,
  OperationReducerActionEnum,
} from "../operations-tracker-container-helper";
import { useTrackerStore } from "../store";

export interface IDataGridView {
  operations: IVerboseOperation[] | null;
  operationsState: IOperationsReducerState;
  dispatchOperationsCount: React.Dispatch<ICountReducerAction>;
  dispatchOperationsState: React.Dispatch<IOperationsAction>;
}

const ItemSize = 40;

export const DataGridView = (props: IDataGridView) => {
  const {
    operations,
    operationsState,
    dispatchOperationsCount,
    dispatchOperationsState,
  } = props;
  const { targetDocument } = useFluent();
  const [selectedColumnOptions] = useTrackerStore(
    (store) => [store.selectedColumnOptions]
  );
  const scrollbarWidth = useScrollbarWidth({ targetDocument });
  const [gridHeight, setGridHeight] = React.useState(400);
  const divRef = React.useRef<HTMLDivElement | null>(null);

  useObserveGridHeight(divRef, setGridHeight);

  const classes = useStyles();

  const filteredOperations: IVerboseOperation[] = React.useMemo(() => {
    return props.operations?.concat([]) ?? [];
  }, [props.operations]);

  const [filters, setFilters] = React.useState<IFilterSet | null>(null);
  const [filteredItems, setFilteredItems] = React.useState(operations || []);

  React.useEffect(() => {
    const items = getFilteredItems(
      operations,
      operationsState.searchText,
      filters
    );
    setFilteredItems(items);
    dispatchOperationsCount({
      type: CountReducerActionEnum.UpdateVerboseOperationsCount,
      value: items?.length,
    });
    dispatchOperationsState({
      type: OperationReducerActionEnum.UpdateFilteredOperations,
      value: items,
    });
  }, [
    filters,
    operationsState.searchText,
    operations,
    dispatchOperationsCount,
    setFilteredItems,
    dispatchOperationsState,
  ]);

  const columns = React.useMemo(
    () => getColumns(!!operationsState.selectedOperation, selectedColumnOptions),
    [operationsState.selectedOperation, selectedColumnOptions]
  );

  const columnSizing = React.useMemo(() => columnSizingOptions(selectedColumnOptions),
  [selectedColumnOptions]
  );

  const operationsMap = React.useMemo(() => {
    const map = new Map<number, IVerboseOperation>();
    filteredOperations?.forEach((op) => {
      map.set(op.id, op);
    });
    return map;
  }, [filteredOperations]);

  const onClick = React.useCallback(
    (item: IVerboseOperation) => {
      const operation = operationsMap.get(item.id);
      dispatchOperationsState({
        type: OperationReducerActionEnum.UpdateSelectedOperation,
        value: operation,
      });
    },
    [dispatchOperationsState, operationsMap]
  );

  const updateFilters = React.useCallback(
    (input: React.SetStateAction<IFilterSet | null>) => {
      setTimeout(() => {
        setFilters(input);
      }, 0);
    },
    [setFilters]
  );

  const updateVerboseOperations = React.useCallback(
    (
      e: React.MouseEvent | React.KeyboardEvent,
      { selectedItems }: { selectedItems: number[] }
    ) => {
      setTimeout(() => {
        const operations: IVerboseOperation[] = [];
        [...selectedItems].forEach((index) =>
          operations.push(filteredItems[index])
        );

        dispatchOperationsState({
          type: OperationReducerActionEnum.UpdateCheckedOperations,
          value: operations,
        });
      }, 0);
    },
    [dispatchOperationsState, filteredItems]
  );

  console.log({selectedColumnOptions});
  console.log({columnSizing});
  return (
    <div className={classes.gridView} ref={divRef}>
      <div className={classes.filterViewWrapper}>
        <FilterView setFilters={updateFilters} filters={filters} />
      </div>
      <div
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
        >
          <DataGridHeader
            style={{
              paddingRight: scrollbarWidth,
              backgroundColor: "#e0e0e0",
            }}
            className={classes.gridHeader}
          >
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody
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
                      <DataGridCell onClick={cb}>
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
  );
};

const useObserveGridHeight = (
  divRef: React.MutableRefObject<HTMLDivElement | null>,
  setGridHeight: React.Dispatch<React.SetStateAction<number>>
) => {
  React.useEffect(() => {
    const height = divRef.current?.getBoundingClientRect().height;
    setGridHeight(height ? height - ItemSize : 400);
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        const height = divRef.current?.getBoundingClientRect().height;
        const calcualtedHeight = height ? height - ItemSize : 400;
        setGridHeight(calcualtedHeight);
      }, 300)
    );
    resizeObserver.observe(document.body);
    return () => {
      resizeObserver.unobserve(document.body);
    };
  }, [setGridHeight, divRef]);
};
