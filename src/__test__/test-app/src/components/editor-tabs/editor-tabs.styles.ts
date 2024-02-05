import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    ...shorthands.padding("5.0rem", "2.0rem"),
    rowGap: "2.0rem",
  },
});
