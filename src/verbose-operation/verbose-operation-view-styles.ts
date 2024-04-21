import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  operationView: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 2,
    minWidth: "15rem",
    height: "100%",
    minHeight: 0,
    boxShadow: `-1.5rem 0 1.2rem -1.2rem ${tokens.colorNeutralShadowAmbientLighter}`,
    ...shorthands.borderLeft(
      ".1rem",
      "solid",
      tokens.colorSubtleBackgroundHover
    ),
  },
  operationNameAccPanel: {
    whiteSpace: "pre-wrap",
    marginLeft: "1rem",
    ...getPanelCommonCss(),
  },
  operationVariablesAccPanel: {
    whiteSpace: "pre-wrap",
    marginLeft: "1rem",
    ...getPanelCommonCss(),
  },
  durationAccPanel: {
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
    ...getPanelCommonCss(),
  },
  accPanel: {
    marginLeft: "1rem",
    ...getPanelCommonCss(),
  },
  resultPanel: {
    whiteSpace: "pre-wrap",
    ...getPanelCommonCss(),
  },
  affectedQueriesAccPanel: {
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
    ...getPanelCommonCss(),
  },
  operationDetails: {
    minHeight: 0,
    overflowY: "auto",
    height: "90%",
    "::-webkit-scrollbar": {
      display: "none",
    },
  },
  operationName: {
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 0,
    minWidth: 0,
    backgroundColor: tokens.colorBrandBackground2Hover,
    ...shorthands.padding("0.5rem"),
  },
  heading: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    flexDirection: "column",
    WebkitAlignItems: "start",
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
    fontSize: ".8rem",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  operationNameText: {
    fontWeight: "bold",
    height: "100%",
    minWidth: 0,
    wordBreak: "break-all",
  },
  button: {
    minWidth: "2rem",
    backgroundColor: "transparent",
    height: "100%",
    minHeight: 0,
    ...shorthands.border("0rem"),
  },
  copyButtonIcon: {
    width: "1.5rem",
    height: "1.5rem",
    "& svg": {
      width: "1.5rem",
      height: "1.5rem",
    },
  },
  dismissButtonIcon: {
    width: "1.5rem",
    height: "1.5rem",
    "& svg": {
      width: "1.25rem",
      height: "1.25rem",
    },
  },
  headerButtons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "left",
    ...shorthands.margin("0.5rem"),
    minWidth: 0,
    minHeight: 0,
    ...shorthands.margin("0.5rem"),
  },
});

function getPanelCommonCss() {
  return {
    ...shorthands.borderRadius("1rem"),
    ...shorthands.padding("0.5rem"),
    backgroundColor: tokens.colorNeutralForeground1Static,
    ...shorthands.border(".1rem", "solid", tokens.colorSubtleBackgroundHover),
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
