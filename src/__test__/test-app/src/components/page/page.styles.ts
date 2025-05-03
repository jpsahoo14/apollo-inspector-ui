import { createStyles } from "../../../../../utils/style-utils";

export const useStyles = () => {
  return styles;
};

const styles = createStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "8px",
    cursor: "pointer",
    borderBottom: "1px solid #e8e8e8",
    "&:hover": {
      backgroundColor: "#e6f7ff"
    }
  },
  active: {
    backgroundColor: "#e6f7ff",
    borderRight: "2px solid #1890ff"
  }
});
