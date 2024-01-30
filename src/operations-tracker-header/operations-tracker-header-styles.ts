import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    ...shorthands.padding("1rem", "1.5rem"),
  },
  infoButton: {
    minWidth: "auto",
    marginRight: ".5rem",
    ...shorthands.padding(0, ".5rem"),
    ...shorthands.border("none"),
  },
  description: {
    ...shorthands.padding("0rem", "1.5rem"),
  },
  openDescription: {
    visibility: "visible",
    height: "auto",
    ...shorthands.overflow("hidden", "auto"),
  },
  buttonContainer: {
    display: "flex",
  },
  recordingButton: {
    color: tokens.colorPaletteRedBackground3,
  },
});
