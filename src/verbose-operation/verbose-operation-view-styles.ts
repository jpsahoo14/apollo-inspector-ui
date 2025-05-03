import { createStyles } from "../utils/style-utils";
import { theme } from 'antd';

export const useStyles = () => {
  const { token } = theme.useToken();
  return styles(token);
};

const styles = (token: any) => createStyles({
  operationView: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 2,
    minWidth: "15rem",
    height: "100%",
    minHeight: 0,
    boxShadow: `-1.5rem 0 1.2rem -1.2rem rgba(0, 0, 0, 0.1)`,
    borderLeft: `.1rem solid ${token.colorBorderSecondary}`,
  },
  operationNameAccPanel: {
    whiteSpace: "pre-wrap",
    marginLeft: "1rem",
    ...getPanelCommonCss(token),
  },
  operationVariablesAccPanel: {
    whiteSpace: "pre-wrap",
    marginLeft: "1rem",
    ...getPanelCommonCss(token),
  },
  durationAccPanel: {
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
    ...getPanelCommonCss(token),
  },
  accPanel: {
    marginLeft: "1rem",
    ...getPanelCommonCss(token),
  },
  resultPanel: {
    whiteSpace: "pre-wrap",
    ...getPanelCommonCss(token),
  },
  affectedQueriesAccPanel: {
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
    ...getPanelCommonCss(token),
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
    backgroundColor: token.colorBgContainer, // Ant Design primary background color
    padding: "0.5rem",
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
    border: "0rem",
  },
  copyButtonIcon: {
    fontSize: "1.5rem",
  },
  dismissButtonIcon: {
    fontSize: "1.5rem",
  },
  headerButtons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "left",
    margin: "0.5rem",
    minWidth: 0,
    minHeight: 0,
  },
});

function getPanelCommonCss(token: any) {
  return {
    borderRadius: "1rem",
    padding: "0.5rem",
    backgroundColor: token.colorBgLayout, // Ant Design background color
    border: `.1rem solid ${token.colorBorderSecondary}`,  // Ant Design border color
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
