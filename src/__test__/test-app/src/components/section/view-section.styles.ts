import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1rem",
  },
  titleWrapper: {
    ...shorthands.border("0.2rem", "solid"),
  },
  contentWrapper: {
    ...shorthands.border("1rem"),
  },
});
