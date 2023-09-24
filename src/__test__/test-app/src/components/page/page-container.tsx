import * as React from "react";
import { Page } from "./page";
import { IPage } from "../../data/resolvers/initial-data/data.interface";
import { Subtitle2Stronger, List, Button } from "@fluentui/react-components";

interface IPageContainerProps {
  page: IPage;
}
export const PageContainer = (props: IPageContainerProps) => {
  const { page } = props;

  const onBtnClick = React.useCallback(() => {}, []);
  const actionButton = (
    <Button onClick={onBtnClick}>{`${
      page.isEditing ? "Save" : "Edit"
    }`}</Button>
  );

  return <Page page={page} actionButton={actionButton} />;
};
