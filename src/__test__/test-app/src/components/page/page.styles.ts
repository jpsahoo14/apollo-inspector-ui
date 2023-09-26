import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: { display: "flex", flexDirection: "column" },
  titleWrapper: {
    display: "flex",
  },
  title: {
    ...shorthands.margin("1rem"),
  },
});
