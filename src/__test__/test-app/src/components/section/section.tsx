import * as React from "react";
import { ISection } from "../../data/resolvers/initial-data/data.interface";
import { Text } from "@fluentui/react-components";

interface ISectionProps {
  section: ISection;
}
export const Section = (props: ISectionProps) => {
  const { section } = props;

  return <Text>{section.content}</Text>;
};
