import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    ...shorthands.padding("10px", "15px"),
  },
  infoButton: {
    minWidth: "auto",
    marginRight: "5px",
    ...shorthands.padding(0, "5px"),
    ...shorthands.border("none"),
    "&:hover": {
      color: tokens.colorBrandBackground2Hover,
    },
  },
  description: {
    ...shorthands.padding("0px", "15px"),
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
    color: tokens.colorPaletteRedBackground2,
    ...shorthands.borderColor(tokens.colorPaletteRedBackground2),
    ":hover": { color: tokens.colorPaletteRedBackground2, ...shorthands.borderColor(tokens.colorPaletteRedBackground2) },
  },
});
