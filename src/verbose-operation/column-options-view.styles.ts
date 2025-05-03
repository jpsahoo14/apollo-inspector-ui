import { createStyles } from "../utils/style-utils";

export const useStyles = () => {
  return styles;
};

const styles = createStyles({
  main: {
    maxWidth: "80rem",
    minWidth: "30rem",
  },
});
