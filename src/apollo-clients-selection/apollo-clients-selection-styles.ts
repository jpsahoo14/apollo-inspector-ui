import { makeStyles, shorthands,tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    ...shorthands.margin("2rem"),
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  label: {},
  checkBoxes: {
    ...shorthands.margin("1rem"),
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    overflowY: "auto",
    minHeight: 0,
    minWidth: 0,
  },
  errorLabel: {
    color: tokens.colorPaletteRedBackground2,
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
    ...shorthands.borderColor(tokens.colorPaletteMinkBackground2),
    ...shorthands.borderStyle("groove"),
    alignItems: "center",
  },
});
