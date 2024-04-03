import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    flexBasic: 0,
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    height: "calc(100% - 1rem)",
    width: "100%",
    ...shorthands.padding("0.5rem"),
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    ...shorthands.overflow("hidden"),
    flexGrow: 1,
  },
  innerContainerDescription: {},
  name: {
    ...shorthands.overflow("hidden"),
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  label: {
    display: "inline-block",
    ...shorthands.padding(".5rem", "1.0rem"),
    ...shorthands.borderRadius("1.2rem"),
    ...shorthands.borderStyle("none"),
  },
  centerDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
