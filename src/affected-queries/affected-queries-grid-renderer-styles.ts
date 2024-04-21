import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    ...shorthands.margin("2rem"),
  },
  gridRowOdd: {
    backgroundColor: tokens.colorSubtleBackgroundPressed,
  },
  headerCellBackground: {
    backgroundColor: tokens.colorBrandBackground2Hover,
  },
});
