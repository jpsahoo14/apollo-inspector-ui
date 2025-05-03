import { createStyles } from "../../../../../utils/style-utils";

export const useStyles = () => {
  return styles;
};

const styles = createStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: "0 8px",
  }
});
