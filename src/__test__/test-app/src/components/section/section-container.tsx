import * as React from "react";
import { ISection } from "../../data/resolvers/initial-data/data.interface";
import { EditSection } from "./edit-section";
import { ViewSection } from "./view-section";

interface ISectionContainerProps {
  section: ISection;
}
export const SectionContainer = (props: ISectionContainerProps) => {
  const { section } = props;

  if (section.isEditing) {
    return <EditSection section={section} />;
  } else {
    return <ViewSection section={section} />;
  }
};
