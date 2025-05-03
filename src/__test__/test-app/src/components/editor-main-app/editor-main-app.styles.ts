import { createStyles } from "../../../../../utils/style-utils";

export const useStyles = () => {
  return styles;
};

const styles = createStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  body: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    overflow: "hidden",
  },
  bodyContent: {
    flex: 1,
    padding: "16px",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },
  visibleContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  welcomePanel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  }
});