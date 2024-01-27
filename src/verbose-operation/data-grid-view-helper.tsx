import * as React from "react";
import {
  TableCellLayout,
  createTableColumn,
  TableColumnDefinition,
} from "@fluentui/react-components";
import {
  IOperationResult,
  IVerboseOperation,
  OperationType,
} from "apollo-inspector";
import { fragmentSubTypes, IFilterSet, querySubTypes } from "./filter-view";
import {
  EditRegular,
  ReadingListRegular,
  PipelineRegular,
  DatabaseLinkRegular,
  BookDatabaseRegular,
  DatabaseSearchRegular,
  DatabaseRegular,
  BookOpenRegular,
  BookLetterRegular,
} from "@fluentui/react-icons";
import { sampleColumnOptions } from "./column-options-view";
import {
  ColumnName,
  CustomColumnWidthOptions,
  Item,
} from "./data-grid.interface";

export const columnSizingOptions = (selectedColumnOptions: string[]) => {
  const columnSizing: { [key: ColumnName]: CustomColumnWidthOptions } = {};
  selectedColumnOptions?.map(function (element) {
    const val = sampleColumnOptions.filter((obj) => obj.key === element)[0];
    columnSizing[val.key] = val.size;
  });
  return columnSizing;
};

export const getColumns = (
  anyOperationSelected: boolean,
  selectedColumnOptions: string[],
): TableColumnDefinition<Item>[] => {
  if (anyOperationSelected) {
    return getSelectedColumns([
      ColumnName.ID,
      ColumnName.Type,
      ColumnName.Name,
    ]);
  } else {
    return getSelectedColumns(selectedColumnOptions);
  }
};

export const getFilteredItems = (
  items: IVerboseOperation[] | null | undefined,
  searchText: string,
  filters: IFilterSet | null
) => {
  let filteredItems = items || [];
  if (searchText.length > 0) {
    const tokens = searchText
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x !== "");
    filteredItems =
      tokens.length > 0
        ? filteredItems.filter((item) => {
            return tokens.find(
              (x) => item.operationName?.toLowerCase().includes(x.toLowerCase())
            );
          })
        : filteredItems;
  }
  if (filters) {
    // filtering based on types
    let filterTypes = filters.types?.concat([]).map((x) => x.toLowerCase());
    if (filterTypes?.includes(OperationType.Query.toLowerCase())) {
      filterTypes = filterTypes.concat(querySubTypes);
    }
    if (filterTypes?.includes(OperationType.Fragment.toLowerCase())) {
      filterTypes = filterTypes.concat(fragmentSubTypes);
    }
    if (filterTypes?.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        filterTypes.includes(item.operationType.toLowerCase())
      );
    }

    // filtering based on results
    const results = filters.results?.concat([]).map((x) => x.toLowerCase());
    if (results?.length > 0) {
      filteredItems = filteredItems.filter((item) => {
        const fromResult = (item.result?.[0] as IOperationResult)?.from;
        return results.includes((fromResult || "").toLowerCase());
      });
    }

    // filtering based on status
    const statuses = filters.statuses?.concat([]).map((x) => x.toLowerCase());
    if (statuses?.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        statuses.includes(item.status.toLowerCase())
      );
    }
  }
  return filteredItems;
};

const getOperationIcon = (type: string) => {
  switch (type) {
    case OperationType.Query: {
      return <ReadingListRegular />;
    }
    case OperationType.Mutation: {
      return <EditRegular />;
    }
    case OperationType.Subscription: {
      return <PipelineRegular />;
    }
    case OperationType.CacheReadQuery: {
      return <DatabaseSearchRegular />;
    }
    case OperationType.CacheWriteQuery: {
      return <DatabaseLinkRegular />;
    }
    case OperationType.CacheReadFragment: {
      return <BookDatabaseRegular />;
    }
    case OperationType.CacheWriteFragment: {
      return <DatabaseRegular />;
    }
    case OperationType.ClientReadFragment: {
      return <BookOpenRegular />;
    }
    case OperationType.ClientWriteFragment: {
      return <BookLetterRegular />;
    }
    case OperationType.ClientReadQuery: {
      return <DatabaseRegular />;
    }
  }
  return null;
};

export const compareString = (a: string | undefined, b: string | undefined) => {
  return (a || "").localeCompare(b || "");
};
const getSelectedColumns = (selectedColumnOptions: string[]) => {
  const tableColumn: TableColumnDefinition<Item>[] = [];
  selectedColumnOptions?.map(function (element) {
    const val = sampleColumnOptions.filter((obj) => obj.key === element)[0];
    !tableColumn.some((obj) => obj.columnId === val.key) &&
      tableColumn.push(
        createTableColumn<Item>({
          columnId: val.key,
          renderHeaderCell: () => val.header,
          compare: (a, b) => val.compare(a, b),
          renderCell: (item) => {
            return (
              <TableCellLayout
                truncate
                key="tableCell"
                media={
                  val.key === ColumnName.Type &&
                  getOperationIcon(item.operationType)
                }
              >
                {val.value(item)}
              </TableCellLayout>
            );
          },
        })
      );
  });

  return tableColumn;
};
