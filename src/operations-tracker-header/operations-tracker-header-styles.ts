import { createStyles } from "../utils/style-utils";

export const useStyles = () => {
  return styles;
};

const styles = createStyles(({ token }) => ({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ".5rem 1rem",
  },
  infoButton: {
    minWidth: "auto",
    padding: "0 .5rem",
    border: "none",
  },
  description: {
    padding: "0rem 1rem",
  },
  openDescription: {
    visibility: "visible",
    height: "auto",
    overflow: "hidden auto",
  },
  buttonContainer: {
    display: "flex",
  },
  stopRecordingButton: {
    color: token.colorError,
    "&:hover": {
      color: token.colorErrorHover,
    },
  },
}));
