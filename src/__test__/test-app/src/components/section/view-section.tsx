import * as React from "react";
import { ISection } from "../../data/resolvers/initial-data/data.interface";
import { Text } from "@fluentui/react-components";
import { useStyles } from "./view-section.styles";

interface IViewSectionProps {
  section: ISection;
}
export const ViewSection = (props: IViewSectionProps) => {
  const { section } = props;
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.titleWrapper}>
        <Text>{section.title}</Text>
      </div>
      <div className={styles.contentWrapper}>
        <Text>{section.content}</Text>
      </div>
    </div>
  );
};
