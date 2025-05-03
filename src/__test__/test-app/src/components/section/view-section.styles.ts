import { createStyles } from "../../../../../utils/style-utils";

export const useStyles = () => {
  return styles;
};

const styles = createStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "16px",
    marginBottom: "16px",
    border: "1px solid #e8e8e8",
    borderRadius: "4px",
  }
});
