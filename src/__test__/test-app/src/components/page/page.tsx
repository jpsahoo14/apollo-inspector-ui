import * as React from "react";
import { useStyles } from "./page.styles";
import { Typography, List, Button } from "antd";

const { Text } = Typography;

interface PageProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  actionButton?: React.ReactNode;
  page?: any;
}

export const Page = (props: PageProps) => {
  const { name, isActive, onClick, children, actionButton, page } = props;
  const classes = useStyles();
  const className = `${classes.root} ${isActive ? classes.active : ""}`;
  return (
    <div className={className} onClick={onClick}>
      <Text strong>{name}</Text>
      {actionButton}
      {children}
    </div>
  );
};
