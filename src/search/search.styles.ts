import { makeStyles, shorthands,tokens } from "@fluentui/react-components";

export const searchStyles = makeStyles({
  root: {
    position: "relative",
    maxWidth: "300px",
  },
  input: {
    display: "inline-block",
    boxSizing: "border-box",
    width: "100%",
    height: "32px",
    ...shorthands.padding(0, 0, 0, "30px"),
    backgroundColor: tokens.colorNeutralStroke2,
    ...shorthands.border("2px", "solid", "transparent"),
    ...shorthands.borderRadius("6px"),
    outlineStyle: "none",
    "&:focus": {
      ...shorthands.borderColor(tokens.colorPaletteBeigeBorderActive),
    },
  },
  icon: {
    position: "absolute",
    top: "5px",
    left: "5px",
  },
});
