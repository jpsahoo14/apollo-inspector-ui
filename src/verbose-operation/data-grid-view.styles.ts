import { createStyles } from "../utils/style-utils";
import { theme } from 'antd';

export const useStyles = () => {
  const { token } = theme.useToken();
  
  return createStyles({
    wholeBody: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      minHeight: 0,
      minWidth: 0,
      flexGrow: 1,
    },
    headers: {
      display: "flex",
      flexDirection: "row",
      minHeight: 0,
      minWidth: 0,
      paddingBottom: "0.5rem",
    },
    gridBody: {
      position: "relative",
      willChange: "transform",
      direction: "ltr",
      cursor: "pointer",
      width: "100%",
      height: "100%",
      backgroundColor: token.colorBgContainer,
    },
    gridHeaderCell: {
      backgroundColor: token.colorPrimaryBg,
      minWidth: "10px !important",
      textOverflow: "ellipsis",
      borderLeft: `0.1rem solid ${token.colorBorderSecondary}`,
      color: token.colorText,
    },
    gridrowcell: {
      minWidth: "10px !important",
      borderLeft: `0.1rem solid ${token.colorBorderSecondary}`,
      color: token.colorText,
    },
    gridRowOdd: {
      backgroundColor: token.colorFillAlter,
    },
    searchBar: {
      paddingRight: "0.5rem",
      position: "relative",
    },
    searchBadge: {
      position: "absolute",
      top: "0.15rem",
      right: "0.7rem",
      backgroundColor: token.colorError,
    },
    gridView: {
      display: "flex",
      height: "100%",
      minHeight: 0,
      minWidth: 0,
    },
    selectedRow: {
      fontWeight: "bold",
      backgroundColor: token.colorPrimaryBg,
      "&:hover": {
        backgroundColor: token.colorPrimaryBgHover,
      },
    },
    failedRow: {
      color: token.colorError,
      "&:hover": {
        color: token.colorErrorHover,
      },
    },
    operationText: {
      overflow: "hidden",
      display: "block",
    },
    selectedOperationGridWrapper: {
      display: "flex",
      height: "100%",
      minHeight: 0,
      minWidth: 0,
      flexGrow: 1,
      ...getGridPaddingMargin(),
    },
    gridWrapper: {
      flexGrow: 1,
      display: "flex",
      height: "100%",
      minHeight: 0,
      minWidth: 0,
      ...getGridPaddingMargin(),
    },
    grid: {
      height: "100%",
      minHeight: 0,
      minWidth: 0,
    },
    filterViewWrapper: {
      display: "flex",
      maxWidth: "30rem",
      height: "100%",
      minHeight: 0,
      minWidth: "fit-content",
      boxShadow: `${token.colorShadow} 0.2rem 0 2.6px`,
    },
    filtersButton: {
      marginRight: ".5rem",
      position: "relative",
    },
    badge: {
      position: "absolute",
      top: "0.15rem",
      right: "3.5rem",
      backgroundColor: token.colorError,
    },
  });
};

function getGridPaddingMargin() {
  return { paddingLeft: "0.2rem", marginRight: "0.2rem" };
}

export type IClasses = Record<
  | "grid"
  | "wholeBody"
  | "headers"
  | "gridBody"
  | "gridHeaderCell"
  | "gridrowcell"
  | "gridView"
  | "failedRow"
  | "selectedRow"
  | "operationText"
  | "selectedOperationGridWrapper"
  | "gridWrapper"
  | "filterViewWrapper"
  | "filtersButton"
  | "searchBar"
  | "badge"
  | "gridRowOdd"
  | "searchBadge",
  string
>;
