import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  filterView: {
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
    paddingLeft: "1rem",
    paddingRight: "1rem",
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
    paddingBottom: "1rem",
  },
  typeText: {
    fontWeight: "bold",
    ...shorthands.padding("1rem"),
    fontSize: "1.2rem",
  },
  operationType: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: "1rem",
  },
});
