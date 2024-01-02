import { makeStyles } from "@fluentui/react-components";

export const useStyles = makeStyles({
  operationView: {
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    flexGrow: 2,
    flexShrink: 0,
    flexBasis: "50%",
    minWidth: 0,
    color: "black",
  },
  operationNameAccPanel: {
    whiteSpace: "pre-wrap",
    marginLeft: "1rem",
    backgroundColor: "white"
  },
  operationVariablesAccPanel: {
    whiteSpace: "pre-wrap",
    marginLeft: "1rem",
    backgroundColor: "white"
  },
  durationAccPanel: {
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white"
  },
  fetchPolicyAccPanel: { marginLeft: "1rem", backgroundColor: "white" },
  errorAccPanel: { marginLeft: "1rem", backgroundColor: "white" },
  warningAccPanel: { marginLeft: "1rem", backgroundColor: "white" },
  resultPanel: {
    whiteSpace: "pre-wrap",
    backgroundColor: "white"
  },
  affectedQueriesAccPanel: {
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white"
  },
  operationDetails: {
    minHeight: 0,
    overflowY: "auto",
    height: "70vh",
    "::-webkit-scrollbar": {
      display: "none",
    },
  },
  operationName: {
    display: "flex",
    flexDirection: "column",
  },
  copyBtn: {
    minHeight: "32px",
    marginLeft: "1rem",
  },
  subHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "32.5px",
    backgroundColor: "aliceblue",
  },
  accordionWrapper: {
    minHeight: 0,
    overflowX: "scroll",
  },
  accordioPreWrapper: {
    maxWidth: "40rem",
    height: "100vh"
  },
  operationType:{
    color: "black",
    fontSize: "10px",
  },
  operationNameText:{
    fontWeight: "bold",
    paddingLeft: "10px",
    paddingRight: "10px"
  },
  closeButton:{
    width: "10px",
    backgroundColor: "transparent"
  }
});

export type stylesKeys =
  | "operationView"
  | "operationNameAccPanel"
  | "operationVariablesAccPanel"
  | "durationAccPanel"
  | "fetchPolicyAccPanel"
  | "errorAccPanel"
  | "warningAccPanel"
  | "affectedQueriesAccPanel"
  | "operationDetails"
  | "operationName"
  | "resultPanel";
