import { createStyles } from "../utils/style-utils";

export const useStyles = () => {
  return styles;
};

const styles = createStyles(({ token }) => ({
  filterView: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: token.colorFillAlter, // Use theme token instead of hardcoded color
    overflowY: "scroll",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    height: "100%",
    "::-webkit-scrollbar": {
      display: "none",
    },
    minHeight: 0,
    minWidth: 0,
    borderRight: `.1rem solid ${token.colorBorderSecondary}`, // Use theme token for border
  },
  filters: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  type: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: "1rem",
  },
  typeText: {
    fontWeight: "bold",
    padding: ".3rem",
    fontSize: ".9rem",
  },
  operationType: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: ".5rem",
  },
}));
