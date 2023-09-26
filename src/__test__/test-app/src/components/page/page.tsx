import * as React from "react";
import { IPage } from "../../data/resolvers/initial-data/data.interface";
import { SectionContainer } from "../section";
import { Subtitle2Stronger, List, Button } from "@fluentui/react-components";
import { useStyles } from "./page.styles";

interface IPageProps {
  page: IPage;
  actionButton: JSX.Element;
}
export const Page = (props: IPageProps) => {
  const { page, actionButton } = props;
  const styles = useStyles();
  const sectionsComp = React.useMemo(() => {
    const sections = page.sections.map((sec) => {
      return <SectionContainer section={sec} key={sec.id} />;
    });
    return <div className={styles.root}>{sections}</div>;
  }, [page.sections]);

  return (
    <div>
      <div className={styles.titleWrapper}>
        <Subtitle2Stronger
          className={styles.title}
        >{`Page Title: ${page.title}`}</Subtitle2Stronger>
        {actionButton}
      </div>
      {sectionsComp}
    </div>
  );
};
