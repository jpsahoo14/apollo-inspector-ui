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
    backgroundColor: "#d4e8fa",
    minWidth: "10px !important",
    textOverflow: "ellipsis",
  },
  gridrowcell: {
    minWidth: "10px !important",
  },
  gridView: {
    flexGrow: 2,
    display: "flex",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  selectedAndFailedRow: {
    color: tokens.colorPaletteRedForeground3,
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground2Hover,
      color: tokens.colorPaletteRedForeground2,
    },
  },
  failedRow: {
    "&:hover": {
      backgroundColor: "unset",
      color: tokens.colorPaletteRedBackground2,
    },
    color: tokens.colorPaletteRedBackground3,
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
    ...getGridPaddingMargin(),
  },
  gridWrapper: {
    flexGrow: 1,
    display: "flex",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    ...getGridPaddingMargin(),
  },
  grid: {
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  filterViewWrapper: {
    flexGrow: 1,
    display: "flex",
    maxWidth: "30rem",
    height: "100%",
    minHeight: 0,
    minWidth: "fit-content",
    boxShadow: `${tokens.colorNeutralShadowAmbientLighter} 0.2rem 0 2.6px`,
  },
  filtersButton: {
    marginRight: ".5rem",
  },
});

function getGridPaddingMargin() {
  return { paddingLeft: "0.2rem", marginRight: "0.2rem" };
}

export type IClasses = Record<
  | "grid"
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
