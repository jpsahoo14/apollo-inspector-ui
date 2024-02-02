import { makeStyles, shorthands } from "@fluentui/react-components";

export const searchStyles = makeStyles({
  root: {
    position: "relative",
    maxWidth: "30rem",
  },
  input: {
    ...shorthands.padding(".5rem",".5rem", 0, '1.6rem'),
    ...shorthands.border(".2rem", "solid", "transparent"),
    ...shorthands.borderRadius(".1rem"),
    outlineStyle: "none",
    display: "inline-block",
    boxSizing: "border-box",
  },
  icon: {
    position: "absolute",
    top: ".5rem",
    left: ".5rem",
  },
});
