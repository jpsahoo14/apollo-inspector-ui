import * as React from "react";
import { ISection } from "../../data/resolvers/initial-data/data.interface";
import { IQueryTab } from "../../types";
import { EditSection } from "./edit-section";
import { ViewSection } from "./view-section";

interface ISectionContainerProps {
  section: ISection;
}

export const SectionContainer = (props: ISectionContainerProps) => {
  const { section } = props;

  // Create empty tabs array since it's required by ViewSection/EditSection
  const emptyTabs: IQueryTab[] = [{ id: `tab-${section.id}`, text: "Default" }];

  if (section.isEditing) {
    return (
      <EditSection
        id={String(section.id)}
        title={section.title}
        tabs={emptyTabs}
        defaultTab={emptyTabs[0].id}
      />
    );
  } else {
    return (
      <ViewSection
        id={String(section.id)}
        title={section.title}
        tabs={emptyTabs}
        defaultTab={emptyTabs[0].id}
      />
    );
  }
};
