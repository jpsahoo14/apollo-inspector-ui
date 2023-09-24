import {
  makeStyles,
  shorthands,
  Tab,
  TabList,
} from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    ...shorthands.padding("50px", "20px"),
    rowGap: "20px",
  },
});
