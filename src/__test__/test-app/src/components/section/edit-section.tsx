import * as React from "react";
import { Typography, Input } from "antd";
import { IQueryTab } from "../../types";

const { Text } = Typography;
const { TextArea } = Input;

interface IEditSectionProps {
  id: string;
  title: string;
  tabs: IQueryTab[];
  defaultTab?: string;
}

export const EditSection = (props: IEditSectionProps) => {
  const { title, tabs, defaultTab } = props;

  return (
    <>
      <div>
        <Text strong>Editing: {title}</Text>
      </div>
    </>
  );
};
