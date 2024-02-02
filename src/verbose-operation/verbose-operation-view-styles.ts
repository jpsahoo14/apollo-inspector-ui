import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  operationView: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 2,
    minWidth: "15rem",
    height: "100%",
    minHeight: 0,
    ...shorthands.borderLeft(
      ".1rem",
      "solid",
      tokens.colorSubtleBackgroundHover
    ),
  },
  operationNameAccPanel: {
    whiteSpace: "pre-wrap",
    marginLeft: "1rem",
    ...getPanelPadding(),
  },
  operationVariablesAccPanel: {
    whiteSpace: "pre-wrap",
    marginLeft: "1rem",
    ...getPanelPadding(),
  },
  durationAccPanel: {
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
    ...getPanelPadding(),
  },
  accPanel: {
    marginLeft: "1rem",
    ...getPanelPadding(),
  },
  resultPanel: {
    whiteSpace: "pre-wrap",
    ...getPanelPadding(),
  },
  affectedQueriesAccPanel: {
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
    ...getPanelPadding(),
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
    minHeight: 0,
    minWidth: 0,
    paddingTop: ".1rem",
    paddingBottom: ".1rem",
    backgroundColor: tokens.colorBrandBackground2Hover,
  },
  heading: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    paddingTop: ".5rem",
    paddingLeft: ".5rem",
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
    fontSize: ".5rem",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  operationNameText: {
    fontWeight: "bold",
    paddingLeft: ".2rem",
    paddingRight: ".2rem",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  button: {
    minWidth: "2rem",
    backgroundColor: "transparent",
    height: "100%",
    minHeight: 0,
    ...shorthands.border("0rem"),
  },
  buttons: {
    alignItems: "left",
  },
});

function getPanelPadding() {
  return {
    ...shorthands.padding("1rem"),
    ...shorthands.borderRadius("1rem"),
    backgroundColor: tokens.colorBrandBackground2Hover,
  };
}

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
