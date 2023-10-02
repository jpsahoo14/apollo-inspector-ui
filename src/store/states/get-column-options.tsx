import { ISet, IColumnOptions } from "../store.interface";
import { createState } from "../create-state";

export const getColumnOptions = (set: ISet): IColumnOptions => {  
  const [selectedColumnOptions, setSelectedColumnOptions] = createState(
    ["id","name","type"],
    "selectedColumnOptions",
    set
  );

  return { selectedColumnOptions, setSelectedColumnOptions };
};
