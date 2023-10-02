import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  filterView: {
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
    paddingLeft: "10px",
    backgroundColor: "#d6d6d6",
    paddingRight: "10px",
    height: "100%",
    "::-webkit-scrollbar": {
      display: "none",
    },
  },
  filters: {
    display: "flex",
    alignItems: "center",
    ...shorthands.borderBottom("0.5px", "solid", "gray"),
  },
  type: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.borderBottom("0.5px", "solid", "gray"),
    paddingBottom: "10px",
  },
  operationType: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.borderBottom("0.5px", "solid", "gray"),
    paddingBottom: "10px",
  },
});
