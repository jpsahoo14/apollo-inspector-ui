import * as React from "react";
import { useStyles } from "./section.styles";
import { Typography } from "antd";

const { Text } = Typography;

export interface ISectionProps {
  title?: string;
  children?: React.ReactNode;
}

export const Section = (props: ISectionProps) => {
  const { title, children } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {title && <Text strong>{title}</Text>}
      {children}
    </div>
  );
};
