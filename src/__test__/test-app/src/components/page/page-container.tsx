import * as React from "react";
import { Page } from "./page";
import { IPage } from "../../data/resolvers/initial-data/data.interface";
import { Button } from "@fluentui/react-components";
import { addSectionMutation, editorQuery } from "../../data/operations";
import { useApolloClient } from "@apollo/client";
import { editor } from "../../data/resolvers/query/editor-resolver";

interface IPageContainerProps {
  page: IPage;
}
export const PageContainer = (props: IPageContainerProps) => {
  const { page } = props;
  const client = useApolloClient();

  const onBtnClick = React.useCallback(async () => {
    try {
      await client.mutate({
        mutation: addSectionMutation,
        variables: { input: { pageId: page.id } },
        update: (cache, result) => {
          console.log({ cache, result });
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
    <Button onClick={onBtnClick}>{`${"Add Section"}`}</Button>
  );

  return <Page page={page} actionButton={actionButton} />;
};
