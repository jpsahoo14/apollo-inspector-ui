import { makeStyles } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  allOperationsView: {
    display: "flex",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    flexGrow: 1,
    flexBasis: "30%",
  },
  selectedOperationView: {
    display: "flex",
    marginTop: "32px",
    backgroundColor: "aliceblue",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    flexBasis: "50%",
  },
  notselectedOperationView: {
    display: "flex",
    marginTop: "32px",
    backgroundColor: "aliceblue",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  operations: {
    display: "flex",
    minHeight: 0,
  },
  operationsList: {
    overflowY: "auto",
    overflowX: "auto",
    marginRight: "1rem",
    minHeight: 0,
    height: "100%",
  },
  operationNameWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  operationsNameListWrapper: {
    display: "flex",
    flexDirection: "column",
    minWidth: "19rem",
    maxWidth: "25rem",
  },
  opCountTxt: {
    marginBottom: "1rem",
    paddingLeft: "1rem",
  },
  copyAllOpBtn: {
    minHeight: "32px",
    marginRight: "1rem",
  },
  operationName: {
    textOverflow: "ellipsis",
    overflowX: "hidden",
    overflowY: "hidden",
    whiteSpace: "nowrap",
  },
  filterLabelMsg: {
    color: "red",
  },
});
