import { createStyles } from "../utils/style-utils";
import { theme } from 'antd';

export const useStyles = () => {
  const { token } = theme.useToken();
  
  return createStyles({
    root: {
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      minWidth: 0,
      flex: 1,
    },
    gridRowOdd: {
      backgroundColor: token.colorFillAlter,
    },
    headerCellBackground: {
      backgroundColor: token.colorPrimaryBg,
      borderLeft: `0.1rem solid ${token.colorBorderSecondary}`,
    },
    gridCellBackground: {
      borderLeft: `0.1rem solid ${token.colorBorderSecondary}`,
    },
  });
};
