import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    flexBasic: 0,
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    height: "100%",
    width: "100%",
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
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
    ...shorthands.padding("5px", "10px"),
    ...shorthands.borderRadius("12px"),
    ...shorthands.borderStyle("none"),
  },
  centerDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
