import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  filterView: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: tokens.colorNeutralBackground2,
    overflowY: "scroll",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    height: "100%",
    "::-webkit-scrollbar": {
      display: "none",
    },
    minHeight: 0,
    minWidth: 0,
    ...shorthands.borderRight(
      ".1rem",
      "solid",
      tokens.colorSubtleBackgroundHover
    ),
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
    ...shorthands.padding(".3rem"),
    fontSize: ".9rem",
  },
  operationType: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: ".5rem",
  },
});
