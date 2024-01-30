import { makeStyles, shorthands } from "@fluentui/react-components";

export const searchStyles = makeStyles({
  root: {
    position: "relative",
    maxWidth: "30rem",
  },
  input: {
    display: "inline-block",
    boxSizing: "border-box",
    width: "100%",
    height: "3.2rem",
    ...shorthands.padding(0, 0, 0, "3rem"),
    ...shorthands.border(".2rem", "solid", "transparent"),
    ...shorthands.borderRadius(".6rem"),
    outlineStyle: "none",
  },
  icon: {
    position: "absolute",
    top: ".5rem",
    left: ".5rem",
  },
});
