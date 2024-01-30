import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  operationView: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 2,
    minWidth: "15rem",
    height: "100%",
    minHeight: 0,
  },
  operationNameAccPanel: {
    whiteSpace: "pre-wrap",
    marginLeft: "1rem",
    ...shorthands.padding("1rem"),
    ...shorthands.borderRadius("1.0rem"),
    backgroundColor: tokens.colorNeutralForegroundInverted,
  },
  operationVariablesAccPanel: {
    whiteSpace: "pre-wrap",
    marginLeft: "1rem",
    ...shorthands.padding("1rem"),
    ...shorthands.borderRadius("1.0rem"),
    backgroundColor: tokens.colorNeutralForegroundInverted,
  },
  durationAccPanel: {
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
    ...shorthands.padding("1rem"),
    ...shorthands.borderRadius("1.0rem"),
    backgroundColor: tokens.colorNeutralForegroundInverted,
  },
  accPanel: {
    ...shorthands.padding("1rem"),
    ...shorthands.borderRadius("1.0rem"),
    marginLeft: "1rem",
    backgroundColor: tokens.colorNeutralForegroundInverted,
  },
  resultPanel: {
    ...shorthands.padding("1rem"),
    ...shorthands.borderRadius("1.0rem"),
    whiteSpace: "pre-wrap",
    backgroundColor: tokens.colorNeutralForegroundInverted,
  },
  affectedQueriesAccPanel: {
    ...shorthands.padding("1rem"),
    ...shorthands.borderRadius("1.0rem"),
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
    backgroundColor: tokens.colorNeutralForegroundInverted,
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
    height: "3.25rem",
    minHeight: 0,
    minWidth: 0,
  },
  heading: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    paddingTop: ".5rem"
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
    // color: tokens.colorNeutralForeground1,
    fontSize: "1.0rem",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  operationNameText: {
    fontWeight: "bold",
    paddingLeft: "1.0rem",
    paddingRight: "1.0rem",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  button: {
    minWidth: "2.0rem",
    backgroundColor: "transparent",
    height: "100%",
    minHeight: 0,
    ...shorthands.border("0rem", "solid", "transparent"),
  },
  buttons: {
    alignItems: "left",
  },
});

export type stylesKeys =
  | "operationView"
  | "operationNameAccPanel"
  | "operationVariablesAccPanel"
  | "durationAccPanel"
  | "accPanel"
  | "affectedQueriesAccPanel"
  | "operationDetails"
  | "operationName"
  | "resultPanel";
