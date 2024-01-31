import { ISet, IColumnOptions } from "../store.interface";
import { createState } from "../create-state";
import { ColumnName } from "../../verbose-operation/data-grid.interface";

export const getColumnOptions = (set: ISet): IColumnOptions => {
  const [selectedColumnOptions, setSelectedColumnOptions] = createState(
    [
      ColumnName.ID,
      ColumnName.Type,
      ColumnName.Name,
      ColumnName.Status,
      ColumnName.FetchPolicy,
      ColumnName.StartAt,
      ColumnName.TotalExecutionTime,
    ],
    "selectedColumnOptions",
    set
  );

  return { selectedColumnOptions, setSelectedColumnOptions };
};
