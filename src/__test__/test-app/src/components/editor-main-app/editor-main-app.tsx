import * as React from "react";
import { useQuery } from "@apollo/client";
import { editorQuery, addSectionMutation } from "../../data/operations";
import { PageContainer } from "../page";
import { Text, Divider, Spinner, Button } from "@fluentui/react-components";
import { useStyles } from "./editor-main-app.test";
import { PageNavigatorListContainer } from "../page-navigator-list";
import { EditorTabs } from "../editor-tabs";
import { UsersList } from "../users-list";
import { produce } from "immer";
import { faker } from "@faker-js/faker";

export const EditorMainApp = () => {
  const styles = useStyles();
  const [editorId, setEditorId] = React.useState(1);
  const { loading, error, pagesComp, updateEditorPagesQuery } = useEditorPages({
    styles,
    editorId,
  });

  if (loading) {
    return (
      <>
        <EditorTabs setEditorId={setEditorId} editorId={editorId} />
        <Spinner />
      </>
    );
  }

  if (error) {
    return (
      <>
        <EditorTabs setEditorId={setEditorId} editorId={editorId} />
        <Text>{"Error"}</Text>
      </>
    );
  }

  return (
    <>
      <EditorTabs setEditorId={setEditorId} editorId={editorId} />
      {pagesComp}
    </>
  );
};

const useEditorPages = ({
  styles,
  editorId,
}: {
  styles: any;
  editorId: number;
}) => {
  const { data, loading, error, updateQuery } = useQuery(editorQuery, {
    variables: { input: { id: editorId } },
    fetchPolicy: "cache-and-network",
  });
  const pagesComp = React.useMemo(() => {
    if (!data?.editor) {
      return null;
    }

    if (editorId === 4) {
      return <UsersList />;
    }

    const page = (
      <div>
        <PageContainer page={data.editor.selectedPage} />
        <Divider />
      </div>
    );

    const OnePage = <div className={styles.main}>{page}</div>;
    const pageList = (
      <div className={styles.pageList}>
        {<PageNavigatorListContainer data={data.editor} />}
      </div>
    );

    return (
      <div className={styles.rootWrapper}>
        <div className={styles.updatePageListBtn}>
          {renderUpdatePageListQueryButton({ updateQuery })}
        </div>
        <div className={styles.root}>
          {pageList}
          {OnePage}
        </div>
      </div>
    );
  }, [data?.editor]);

  return { loading, error, pagesComp, updateEditorPagesQuery: updateQuery };
};

const renderUpdatePageListQueryButton = ({
  updateQuery: updateEditorPagesQuery,
}) => {
  const updatePageList = () => {
    updateEditorPagesQuery((prevResult) => {
      const result = produce(prevResult, (draft) => {
        draft.editor.pages[0].title = `${faker.person.firstName()}`;
        return draft;
      });

      return result;
    });
  };

  return <Button onClick={updatePageList}>{`Update pages list`}</Button>;
};
