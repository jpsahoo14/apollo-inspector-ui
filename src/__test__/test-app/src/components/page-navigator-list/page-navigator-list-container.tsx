import * as React from "react";
import {
  IEditorData,
  IPage,
} from "../../data/resolvers/initial-data/data.interface";
import {
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  Accordion,
} from "@fluentui/react-components";
import { useStyles } from "./page-navigator-list-container.styles";
import { setSelectedPageMutation, editorQuery } from "../../data/operations";
import { ApolloClient, InMemoryCache, useApolloClient } from "@apollo/client";
import { produce } from "immer";

interface IPageNavigatorListContainerProps {
  data: IEditorData;
}
export const PageNavigatorListContainer = (
  props: IPageNavigatorListContainerProps
) => {
  const { data } = props;
  const pages = data.pages;
  const selectedPage = [`${data.selectedPage.id}`];
  const styles = useStyles();
  const client = useApolloClient();

  const setSelectedPageCB = useSetSelectedPageCB(client);
  const accordion = React.useMemo(() => {
    const comp = pages.map((pg) => {
      const comp = (
        <AccordionItem value={`${pg.id}`} key={`${pg.id}`}>
          <AccordionHeader>{`${pg.title}`}</AccordionHeader>
          {getAccordionPanel(pg)}
        </AccordionItem>
      );

      return comp;
    });
    return (
      <Accordion
        collapsible
        onToggle={setSelectedPageCB}
        openItems={selectedPage}
      >
        {comp}
      </Accordion>
    );
  }, [pages, getAccordionPanel, setSelectedPageCB, selectedPage]);

  return <div className={styles.root}>{accordion}</div>;
};

const getAccordionPanel = (page: IPage) => {
  const comp = page.sections.map((sec) => {
    const comp = (
      <AccordionPanel key={sec.id}>
        <div>{`${sec.title}`}</div>
      </AccordionPanel>
    );

    return comp;
  });

  return comp;
};

const useSetSelectedPageCB = (client: ApolloClient<object>) =>
  React.useCallback(async (_: any, { value }: { value: string }) => {
    //setSelectedPage(openItems);
    const pageId = parseInt(value);
    const editorQueryData = readEditorQueryData(client);
    const actualPage = editorQueryData.editor.pages.find(
      (pg) => pg.id === pageId
    );
    const optimisticData = {
      setSelectedPage: actualPage,
    };
    await setSelectedPageMutationCB(client, pageId, optimisticData);
  }, []);

const setSelectedPageMutationCB = async (
  client: any,
  pageId: number,
  optimisticData: { setSelectedPage: any }
) =>
  await client.mutate({
    mutation: setSelectedPageMutation,
    variables: { input: { pageId } },
    optimisticResponse: optimisticData,
    update: (cache: InMemoryCache, { data }) => {
      const editorQueryData = readEditorQueryData(client);

      const updatedState = produce(editorQueryData, (draft) => {
        draft.editor.selectedPage = data.setSelectedPage;
      });
      client.writeQuery({
        query: editorQuery,
        variables: { input: { id: 1 } },
        data: updatedState,
      });
    },
  });

const readEditorQueryData = (client: any) =>
  client.readQuery({
    query: editorQuery,
    variables: { input: { id: 1 } },
  });
