import { makeStyles, shorthands } from "@fluentui/react-components";

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
    // "::-webkit-scrollbar": {
    //   display: "none",
    // },
  },
  gridRow: {
    ":hover": {
      backgroundColor: "aliceblue",
    },
  },
  gridHeaderCell: {
    backgroundColor: "#d4e8fa",
  },
  gridrowcell: {},
  gridView: {
    flexGrow: 2,
    display: "flex",
    "&:hover": {
      backgroundColor: "unset !important",
      color: "unset !important",
    },
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  selectedAndFailedRow: {
    color: "darkred",
    backgroundColor: "aliceblue",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "aliceblue",
      color: "darkred",
    },
  },
  failedRow: {
    "&:hover": {
      backgroundColor: "unset",
      color: "red",
    },
    color: "red",
  },
  selectedRow: {
    backgroundColor: "aliceblue",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "aliceblue",
    },
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
