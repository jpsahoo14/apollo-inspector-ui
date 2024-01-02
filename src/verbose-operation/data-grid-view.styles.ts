import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  gridBody: {
    position: "relative",
    willChange: "transform",
    direction: "ltr",
    cursor: "pointer",
    width: "100%",
    height: "100%",
    overflowY: "scroll",
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
  gridrowcell:{
    minWidth: "fit-content"
  },
  gridView: {
    minWidth: 0,
    height: "100%",
    flexGrow: 2,
    display: "flex",
    "&:hover": {
      backgroundColor: "unset !important",
      color: "unset !important",
    },
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
    minWidth: 0,
    overflowX: "auto",
    flexShrink: 1,
    // flexGrow: 2,
  },
  gridWrapper: {
    flexGrow: 1,
    minWidth: 0,
    overflowX: "auto",
    width: "100vw",
  },
  grid:{
    minWidth: "fit-content"
  },
  filterViewWrapper: {
    flexGrow: 1,
    minWidth: 0,
    maxWidth: "300px",
    height: "100vh"
  },
  headers:{
    display: "flex",
    flexDirection: "row",
  },
  wholeBody:{
    display: "flex",
    flexDirection: "column",
  },
  headers:{
    display: "flex",
    flexDirection: "row",
  },
  wholeBody:{
    display: "flex",
    flexDirection: "column",
  },
});
