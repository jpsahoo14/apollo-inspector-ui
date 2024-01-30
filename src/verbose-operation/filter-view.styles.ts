import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  filterView: {
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
    paddingLeft: "10px",
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
  },
  type: {
    display: "flex",
    flexDirection: "column",
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
    paddingBottom: "10px",
  },
});
