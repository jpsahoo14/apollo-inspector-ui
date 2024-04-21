import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    height: "100%",
    width: "100%",
  },
  leftPaneHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    ...shorthands.padding(".5rem", "0.5rem"),
    backgroundColor: tokens.colorSubtleBackgroundHover,
    ...shorthands.borderBottom(
      ".1rem",
      "solid",
      tokens.colorNeutralShadowAmbientLighter
    ),
    maxWidth: "100%",
    justifyContent: "space-between",
  },
  divider: {
    width: "1rem",
    maxWidth: "1rem",
  },
  expandToAvailableSpace: {
    ...shorthands.flex(1),
  },
  verboseOperationViewWrapper: {
    display: "flex",
    minHeight: "0",
    minWidth: 0,
    flexBasis: "50%",
  },
  emptyPage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  leftPane: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    minHeight: 0,
    minWidth: 0,
    height: "100%",
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRight(
      ".1rem",
      "solid",
      tokens.colorSubtleBackgroundHover
    ),
  },
  infoButton: {
    minWidth: "auto",
    alignItems: "end",
    ...shorthands.border("none"),
    backgroundColor: tokens.colorSubtleBackgroundHover,
  },
  rightPane: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    minHeight: 0,
    minWidth: 0,
    height: "100%",
    ...shorthands.flex(1),
  },
  affectedQueriesGridWrapper: {
    display: "flex",
    minHeight: 0,
    minWidth: 0,
    ...shorthands.margin("1rem"),
    height: "100%",
  },

  rightPaneHeader: {
    display: "flex",
    ...shorthands.padding(".5rem", "0.5rem"),
    backgroundColor: tokens.colorSubtleBackgroundHover,
    minHeight: "2rem",
    ...shorthands.padding("1rem"),
  },
  selectedTab: {
    backgroundColor: tokens.colorBrandBackground2Hover,
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  tabListItem: {
    height: "2.5rem",
  },
});

export type IClasses =
  | "root"
  | "selectedTab"
  | "infoButton"
  | "leftPaneHeader"
  | "leftPane"
  | "rightPane"
  | "rightPaneHeader"
  | "affectedQueriesGridWrapper"
  | "tabListItem"
  | "verboseOperationViewWrapper"
  | "expandToAvailableSpace"
  | "emptyPage";
