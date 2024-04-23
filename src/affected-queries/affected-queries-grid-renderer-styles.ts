import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minWidth: 0,
    ...shorthands.flex(1),
  },
  gridRowOdd: {
    backgroundColor: tokens.colorSubtleBackgroundPressed,
  },
  headerCellBackground: {
    backgroundColor: tokens.colorBrandBackground2Hover,
    ...shorthands.borderLeft("0.1rem", "solid", tokens.colorNeutralStroke2),
  },
  gridCellBackground: {
    ...shorthands.borderLeft("0.1rem", "solid", tokens.colorNeutralStroke2),
  },
});
