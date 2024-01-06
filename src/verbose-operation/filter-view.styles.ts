import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  filterView: {
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
    paddingLeft: "10px",
    backgroundColor: "#f1f4f7",
    paddingRight: "10px",
    height: "100%",
    "::-webkit-scrollbar": {
      display: "none",
    },
    minHeight: 0,
    minWidth: 0,
  },
  filters: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    ...shorthands.borderBottom("0.5px", "solid", "gray"),
  },
  type: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.borderBottom("0.5px", "solid", "gray"),
    paddingBottom: "10px",
  },
  typeText: {
    fontWeight: "bold",
    ...shorthands.padding("10px"),
    fontSize: "12px",
  },
  operationType: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.borderBottom("0.5px", "solid", "gray"),
    paddingBottom: "10px",
  },
});
