import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    ...shorthands.padding(".5rem", "1rem"),
  },
  infoButton: {
    minWidth: "auto",
    ...shorthands.padding(0, ".5rem"),
    ...shorthands.border("none"),
  },
  description: {
    ...shorthands.padding("0rem", "1rem"),
  },
  openDescription: {
    visibility: "visible",
    height: "auto",
    ...shorthands.overflow("hidden", "auto"),
  },
  buttonContainer: {
    display: "flex",
  },
  stopRecordingButton: {
    color: tokens.colorStatusDangerBackground3,
    "&:hover": {
      color: tokens.colorStatusDangerBackground3,
    },
  },
});
