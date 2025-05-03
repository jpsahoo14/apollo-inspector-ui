import { createStyles } from "../../../../../utils/style-utils";

export const useStyles = () => {
  return styles;
};

const styles = createStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxHeight: "300px",
    overflow: "auto",
  }
});
