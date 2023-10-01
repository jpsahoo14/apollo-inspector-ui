import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    ...shorthands.margin("2rem"),
    display: "flex",
    flexDirection: "column",
  },
  label: {
    ...shorthands.margin("1rem"),
  },
  checkBoxes: {
    ...shorthands.margin("1rem"),
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  errorLabel: {
    color: "red",
  },
  copyButton: {
    ...shorthands.margin("0.5rem"),
  },
  checkboxWrapper: {
    ...shorthands.margin("0.5rem"),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    ...shorthands.borderWidth("0.1rem"),
    ...shorthands.borderColor("gray"),
    ...shorthands.borderStyle("groove"),
    alignItems: "center",
  },
});
