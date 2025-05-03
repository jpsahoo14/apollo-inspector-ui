import { createStyles } from './utils/style-utils';

export const useStyles = () => {
  return styles;
};

const styles = createStyles({
  root: {
    flexBasic: 0,
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    height: "calc(100% - 1rem)",
    width: "100%",
    padding: "0.5rem",
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    flexGrow: 1,
  },
  innerContainerDescription: {},
  name: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  label: {
    display: "inline-block",
    padding: ".5rem 1.0rem",
    borderRadius: "1.2rem",
    border: "none",
  },
  centerDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
