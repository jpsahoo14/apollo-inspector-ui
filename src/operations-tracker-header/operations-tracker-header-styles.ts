import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  topHeader:{
    display: "flex",
    alignItems: "center",
    backgroundColor: "#b4d7f5",
    width: "100%",
    height: "60px",
    justifyContent: "center",
    fontSize:"20px", 
    fontFamily: "monospace",
  },
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
      color: "#97CBFF",
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
    color: "red",
    ...shorthands.borderColor("red"),
    ":hover": { color: "red", ...shorthands.borderColor("red") },
  },
});
