import * as React from "react";
import { Page } from "./page";
import { IPage } from "../../data/resolvers/initial-data/data.interface";
import { Button } from "antd";
import { addSectionMutation, editorQuery } from "../../data/operations";
import { useApolloClient } from "@apollo/client";

interface IPageContainerProps {
  page: IPage;
  isActive?: boolean;
  onClick?: () => void;
}

export const PageContainer = (props: IPageContainerProps) => {
  const { page, isActive = false, onClick } = props;
  const client = useApolloClient();

  const onBtnClick = React.useCallback(async () => {
    try {
      await client.mutate({
        mutation: addSectionMutation,
        variables: { input: { pageId: page.id } },
        update: (cache, result) => {
          const cachedData: any = cache.readQuery({
            query: editorQuery,
            variables: { input: { id: 1 } },
          });
          const updatedData = {
            ...cachedData,
            editor: {
              ...cachedData.editor,
              selectedPage: {
                ...cachedData.editor.selectedPage,
                sections: [
                  ...cachedData.editor.selectedPage.sections,
                  result.data.addSection,
                ],
              },
            },
          };

          cache.writeQuery({ query: editorQuery, data: updatedData });
        },
      });
    } catch (e) {
      console.log(e);
    }
  }, [client, page]);

  const actionButton = (
    <Button onClick={onBtnClick} size="small">{`${"Add Section"}`}</Button>
  );

  return (
    <Page
      name={page.title || "Untitled"}
      isActive={isActive}
      onClick={onClick || (() => {})}
      actionButton={actionButton}
      page={page}
    />
  );
};
