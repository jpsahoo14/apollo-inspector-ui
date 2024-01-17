import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    ...shorthands.border("0.2rem", "solid", tokens.colorNeutralForeground1),
  },
});
