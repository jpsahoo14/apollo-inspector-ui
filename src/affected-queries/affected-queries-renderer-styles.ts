import { createStyles } from "../utils/style-utils";

export const useStyles = () => {
  return styles;
};

const styles = createStyles({
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
    padding: ".5rem 0.5rem",
    backgroundColor: "#f5f5f5", // Ant Design background color
    borderBottom: ".1rem solid #e8e8e8", // Ant Design border color
    maxWidth: "100%",
    justifyContent: "space-between",
  },
  divider: {
    width: "1rem",
    maxWidth: "1rem",
  },
  expandToAvailableSpace: {
    flex: 1,
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
    backgroundColor: "#fafafa", // Ant Design background color
    borderRight: ".1rem solid #e8e8e8", // Ant Design border color
  },
  infoButton: {
    minWidth: "auto",
    alignItems: "end",
    border: "none",
    backgroundColor: "#f5f5f5", // Ant Design background color
  },
  rightPane: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    minHeight: 0,
    minWidth: 0,
    height: "100%",
    flex: 1,
  },
  affectedQueriesGridWrapper: {
    display: "flex",
    minHeight: 0,
    minWidth: 0,
    margin: "1rem",
    height: "100%",
  },
  rightPaneHeader: {
    display: "flex",
    padding: ".5rem 0.5rem",
    backgroundColor: "#f5f5f5", // Ant Design background color
    minHeight: "2rem",
    padding: "1rem",
  },
  selectedTab: {
    backgroundColor: "#e6f7ff", // Ant Design selected color
    "&:hover": {
      backgroundColor: "#e6f7ff", // Ant Design selected hover color
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
