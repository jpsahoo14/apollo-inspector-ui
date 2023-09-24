import { makeStyles } from "@fluentui/react-components";

export const useStyles = makeStyles({
  rootWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  root: { display: "flex", flexDirection: "row" },
  main: {
    display: "flex",
    flexDirection: "column",
  },
  updatePageListBtn: {
    marginBottom: "1rem",
  },
  pageList: {
    minWidth: "20rem",
  },
});
