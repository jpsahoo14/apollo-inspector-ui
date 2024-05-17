import * as React from "react";
import { useScrollbarWidth, useFluent } from "@fluentui/react-components";
import { IVerboseOperation } from "apollo-inspector";
import { CountReducerActionEnum } from "../operations-tracker-body";
import { IFilterSet } from "./filter-view";
import { debounce } from "lodash-es";
import {
  columnSizingOptions,
  getColumns,
  getFilteredItems,
} from "./data-grid-view-helper";
import { ColumnName, IDataGridView } from "./data-grid.interface";
import {
  IOperationsAction,
  IOperationsReducerState,
  OperationReducerActionEnum,
} from "../operations-tracker-container-helper";
import { TrackerStoreContext } from "../store";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

const ItemSize = 20;

export const useDataGridView = (props: IDataGridView) => {
  const { operationsState, dispatchOperationsState } = props;

  const { scrollbarWidth } = useScrollbarWidthInternal();
  const divRef = React.useRef<HTMLDivElement | null>(null);

  const { gridHeight } = useObserveGridHeight(divRef);
  const { updateFilters, filters, filteredItems, updateVerboseOperations } =
    useFilterLogic(props);
  const { columns, columnSizing } = useGridColumns(operationsState);

  const onClick = useOnSelectAnOperation(props, dispatchOperationsState);
  const { showFiltersView, handleToggleFilters } = useShowFilterView();

  return {
    gridHeight,
    handleToggleFilters,
    divRef,
    showFilters: showFiltersView,
    updateFilters,
    filters,
    operationsState,
    filteredItems,
    columns,
    columnSizing,
    updateVerboseOperations,
    scrollbarWidth,
    onClick,
  };
};

/**
 * Computes the width of the scrollbar, which can be used as padding
 * to data-grid so that scrollbar doesn't overlay on content
 * @returns scrollbarWidth
 */
const useScrollbarWidthInternal = () => {
  const { targetDocument } = useFluent();
  const scrollbarWidth = useScrollbarWidth({ targetDocument });

  return { scrollbarWidth };
};

const useObserveGridHeight = (
  divRef: React.MutableRefObject<HTMLDivElement | null>
) => {
  const [gridHeight, setGridHeight] = React.useState(400);
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

  return {
    gridHeight,
  };
};

const useShowFilterView = () => {
  const [showFiltersView, setShowFiltersView] = React.useState(true); // State to manage visibility of filters

  const handleToggleFilters = React.useCallback(() => {
    setShowFiltersView((state) => !state); // Toggle the visibility of filters
  }, [setShowFiltersView]);

  useWindowResize(setShowFiltersView);

  return {
    showFiltersView,
    handleToggleFilters,
  };
};
const useWindowResize = (
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 500);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    if (windowWidth < 900) {
      setShowFilters(false);
    }
  }, [windowWidth]);
};

const useGridColumns = (operationsState: IOperationsReducerState) => {
  const store = React.useContext(TrackerStoreContext);
  const [selectedColumnOptions] = useStore(
    store,
    useShallow((store) => [store.selectedColumnOptions])
  );
  const columns = React.useMemo(
    () =>
      getColumns(!!operationsState.selectedOperation, selectedColumnOptions),
    [operationsState.selectedOperation, selectedColumnOptions]
  );

  const columnSizing = React.useMemo(
    () => columnSizingOptions(selectedColumnOptions),
    [selectedColumnOptions]
  );

  useShouldShowClientIdColumn();
  return { columns, columnSizing };
};

const useOnSelectAnOperation = (
  props: IDataGridView,
  dispatchOperationsState: React.Dispatch<IOperationsAction>
) => {
  const filteredOperations: IVerboseOperation[] = React.useMemo(() => {
    return props.operations?.concat([]) ?? [];
  }, [props.operations]);

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
  return onClick;
};

const useFilterLogic = (props: IDataGridView) => {
  const {
    operations,
    operationsState,
    dispatchOperationsCount,
    dispatchOperationsState,
  } = props;

  const store = React.useContext(TrackerStoreContext);
  const [filters, setFilters] = useStore(
    store,
    useShallow((store) => [store.filterSet, store.setFilterSet])
  );
  const [filteredItems, setFilteredItems] = React.useState<IVerboseOperation[]>(
    operationsState.filteredOperations || []
  );

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

  const updateFilters = React.useCallback(
    (input: React.SetStateAction<IFilterSet>) => {
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

  return { updateFilters, updateVerboseOperations, filters, filteredItems };
};

const useShouldShowClientIdColumn = () => {
  const store = React.useContext(TrackerStoreContext);
  const [setSelectedColumnOptions] = useStore(
    store,
    useShallow((store) => [store.setSelectedColumnOptions])
  );

  const [selectedApolloClientIds] = useStore(
    store,
    useShallow((store) => [store.selectedApolloClientIds])
  );
  const hasCheckedRef = React.useRef(false);

  if (hasCheckedRef.current === false) {
    if (selectedApolloClientIds.length > 1) {
      setSelectedColumnOptions((prev) => {
        if (!prev.find((elem) => elem === ColumnName.CliendId)) {
          const modifiedColumnOptions = [...prev];
          modifiedColumnOptions.splice(1, 0, ColumnName.CliendId);
          return modifiedColumnOptions;
        }

        return prev;
      });
    }
    hasCheckedRef.current = true;
  }
};
