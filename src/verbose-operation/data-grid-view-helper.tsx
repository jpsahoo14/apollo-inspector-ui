import * as React from "react";
import { Typography, Space } from "antd";
import {
  ReadOutlined,
  EditOutlined,
  ApiOutlined,
  SearchOutlined,
  DatabaseOutlined,
  BookOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import {
  IOperationResult,
  IVerboseOperation,
  OperationType,
} from "apollo-inspector";
import { fragmentSubTypes, IFilterSet, querySubTypes } from "./filter-view";
import { SAMPLE_COLUMN_OPTIONS } from "./column-options-view";
import {
  ColumnName,
  CustomColumnWidthOptions,
  Item,
} from "./data-grid.interface";

const { Text } = Typography;

export const columnSizingOptions = (selectedColumnOptions: string[]) => {
  const columnSizing: { [key: ColumnName]: CustomColumnWidthOptions } = {};
  selectedColumnOptions?.map(function (element) {
    const val = SAMPLE_COLUMN_OPTIONS.filter((obj) => obj.key === element)[0];
    columnSizing[val.key] = val.size;
  });
  return columnSizing;
};

export const getColumns = (
  anyOperationSelected: boolean,
  selectedColumnOptions: string[]
) => {
  if (anyOperationSelected) {
    return getSelectedColumns([
      ColumnName.ID,
      ColumnName.Name,
      ColumnName.Type,
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
      return <ReadOutlined />;
    }
    case OperationType.Mutation: {
      return <EditOutlined />;
    }
    case OperationType.Subscription: {
      return <ApiOutlined />;
    }
    case OperationType.CacheReadQuery: {
      return <SearchOutlined />;
    }
    case OperationType.CacheWriteQuery: {
      return <DatabaseOutlined />;
    }
    case OperationType.CacheReadFragment: {
      return <FileSearchOutlined />;
    }
    case OperationType.CacheWriteFragment: {
      return <FileAddOutlined />;
    }
    case OperationType.ClientReadFragment: {
      return <BookOutlined />;
    }
    case OperationType.ClientWriteFragment: {
      return <FileTextOutlined />;
    }
    case OperationType.ClientReadQuery: {
      return <DatabaseOutlined />;
    }
  }
  return null;
};

export const compareString = (a: string | undefined, b: string | undefined) => {
  return (a || "").localeCompare(b || "");
};

const getSelectedColumns = (selectedColumnOptions: string[]) => {
  const tableColumn = [];
  selectedColumnOptions?.map(function (element) {
    const val = SAMPLE_COLUMN_OPTIONS.filter((obj) => obj.key === element)[0];
    !tableColumn.some((obj) => obj.columnId === val.key) &&
      tableColumn.push({
        key: val.key,
        dataIndex: val.key,
        title: val.header,
        sorter: (a, b) => val.compare(a, b),
        ellipsis: true, // Ensure ellipsis for overflow
        width: val.size?.idealWidth || 180, // Use idealWidth if available, else fallback
        render: (text, item) => {
          const icon =
            val.key === ColumnName.Type
              ? getOperationIcon(item.operationType)
              : null;
          return (
            <Space
              style={{
                maxWidth: val.size?.idealWidth || 180,
                overflow: "hidden",
              }}
            >
              {icon}
              <Text
                ellipsis
                style={{
                  maxWidth: (val.size?.idealWidth || 180) - 24,
                  display: "inline-block",
                  overflow: "hidden",
                }}
              >
                {val.value(item)}
              </Text>
            </Space>
          );
        },
      });
  });

  return tableColumn;
};
