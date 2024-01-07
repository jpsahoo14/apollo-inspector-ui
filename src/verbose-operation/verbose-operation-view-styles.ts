import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  operationView: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 2,
    color: "black",
    minWidth: "15rem",
    height: "100%",
    minHeight: 0,
  },
  operationNameAccPanel: {
    whiteSpace: "pre-wrap",
    marginLeft: "1rem",
    backgroundColor: "white",
  },
  operationVariablesAccPanel: {
    whiteSpace: "pre-wrap",
    marginLeft: "1rem",
    backgroundColor: "white",
  },
  durationAccPanel: {
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
  },
  fetchPolicyAccPanel: { marginLeft: "1rem", backgroundColor: "white" },
  errorAccPanel: { marginLeft: "1rem", backgroundColor: "white" },
  warningAccPanel: { marginLeft: "1rem", backgroundColor: "white" },
  resultPanel: {
    whiteSpace: "pre-wrap",
    backgroundColor: "white",
  },
  affectedQueriesAccPanel: {
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
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
  subHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "32.5px",
    backgroundColor: "aliceblue",
    minHeight: 0,
    minWidth: 0,
  },
  heading: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  accordionWrapper: {
    display: "flex",
    overflowX: "scroll",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  accordionPreWrapper: {
    display: "flex",
    maxWidth: "40rem",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  operationType: {
    color: "black",
    fontSize: "10px",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  operationNameText: {
    fontWeight: "bold",
    paddingLeft: "10px",
    paddingRight: "10px",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  button: {
    minWidth: "20px",
    backgroundColor: "transparent",
    height: "100%",
    color: "black",
    minHeight: 0,
    ...shorthands.border("0px", "solid", "transparent"),
  },
  buttons: {
   alignItems: "left"
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
