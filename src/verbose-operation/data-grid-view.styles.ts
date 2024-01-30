import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  wholeBody: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    flexGrow: 1,
  },
  headers: {
    display: "flex",
    flexDirection: "row",
    minHeight: 0,
    minWidth: 0,
  },
  gridBody: {
    position: "relative",
    willChange: "transform",
    direction: "ltr",
    cursor: "pointer",
    width: "100%",
    height: "100%",
  },
  gridHeaderCell: {
  },
  gridrowcell: {
  },
  gridView: {
    flexGrow: 2,
    display: "flex",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  selectedAndFailedRow: {
    color: tokens.colorPaletteRedForeground2,
    backgroundColor: tokens.colorBrandBackground2Pressed,
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground2Hover,
      color: tokens.colorPaletteRedForeground2,
    },
  },
  failedRow: {
    "&:hover": {
      backgroundColor: "unset",
      color: tokens.colorPaletteRedBackground3,
    },
    color: tokens.colorPaletteRedBackground2,
  },
  selectedRow: {
    fontWeight: "bold",
  },
  operationText: {
    ...shorthands.overflow("hidden"),
    display: "block",
  },
  selectedOperationGridWrapper: {
    display: "flex",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    flexGrow: 1,
  },
  gridWrapper: {
    flexGrow: 1,
    display: "flex",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  grid: {
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  filterViewWrapper: {
    flexGrow: 1,
    display: "flex",
    maxWidth: "300px",
    height: "100%",
    minHeight: 0,
    minWidth: "fit-content",
  },
});

export type IClasses = Record<
  | "grid"
  | "gridRow"
  | "wholeBody"
  | "headers"
  | "gridBody"
  | "gridHeaderCell"
  | "gridrowcell"
  | "gridView"
  | "selectedAndFailedRow"
  | "failedRow"
  | "selectedRow"
  | "operationText"
  | "selectedOperationGridWrapper"
  | "gridWrapper"
  | "filterViewWrapper",
  string
>;
