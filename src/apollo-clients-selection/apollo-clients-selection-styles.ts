import { createStyles } from "../utils/style-utils";

export const useStyles = () => {
  return styles;
};

const styles = createStyles({
  root: {
    margin: "2rem",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  label: {},
  checkBoxes: {
    margin: "1rem",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    overflowY: "auto",
    minHeight: 0,
    minWidth: 0,
  },
  errorLabel: {
    color: "#ff4d4f", // Ant Design danger color
  },
  copyButton: {
    margin: "0.5rem",
  },
  checkboxWrapper: {
    margin: "0.5rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: "0.1rem",
    borderStyle: "groove",
    alignItems: "center",
  },
});
