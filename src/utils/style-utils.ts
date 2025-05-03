// Style utility to replace FluentUI makeStyles with a more compatible approach for Ant Design
import { CSSProperties } from "react";
import { GlobalToken } from "antd/es/theme/interface";
import { theme } from "antd";
const { darkAlgorithm, getDesignToken } = theme;

const tokens = getDesignToken({
  token: {
    colorPrimary: "#13c2c2",
    borderRadius: 8,
  },
  algorithm: darkAlgorithm, // or defaultAlgorithm for light theme
});

type StylesContext = {
  token: GlobalToken;
};

// Simple CSS-in-JS utility to help transition from FluentUI
export const createStyles = <T extends Record<string, CSSProperties>>(
  stylesFn: (context: StylesContext) => T
): T => {
  // In a real implementation, we would pass the actual theme token
  // But for TypeScript checking purposes, we just need a valid type
  if (typeof stylesFn !== "function") {
    return stylesFn;
  }
  return stylesFn({ token: tokens });
};
