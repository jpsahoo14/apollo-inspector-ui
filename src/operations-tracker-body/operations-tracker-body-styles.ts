import { createStyles } from '../utils/style-utils';

export const useStyles = () => {
  return styles;
};

const styles = createStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  operationTabList: {
    marginBottom: "1rem",
  },
});
