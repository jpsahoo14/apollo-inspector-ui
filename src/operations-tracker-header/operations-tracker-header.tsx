import React from "react";
import { Button } from "@fluentui/react-components";
import { Info20Regular } from "@fluentui/react-icons";
import { useStyles } from "./operations-tracker-header-styles";
import { Search } from "../search/search";
import { debounce } from "lodash";
import { CopyButton } from "./operations-copy-button";
import { IOperationsReducerState } from "../operations-tracker-container-helper";
import { IDataView } from "apollo-inspector";
import { useTrackerStore } from "../store";

export interface IOperationsTrackerHeaderProps {
  setOpenDescription: React.Dispatch<React.SetStateAction<boolean>>;
  openDescription: boolean;
  toggleRecording: () => void;
  setSearchText: (text: string) => void;
  operationsState: IOperationsReducerState;
  clearApolloOperations: () => void;
  showClear: boolean;
}

export const OperationsTrackerHeader = React.memo(
  (props: IOperationsTrackerHeaderProps) => {
    const classes = useStyles();
    const {
      openDescription,
      setOpenDescription,
      toggleRecording,
      setSearchText,
      operationsState,
      clearApolloOperations,
      showClear
    } = props;

    const [searchBanner, setSearchBanner,
      isRecording,
      apollOperationsData] = useTrackerStore((store) => [
      store.searchBanner,
      store.setSearchBanner,
      store.isRecording,
      store.apollOperationsData
    ]);
    
    const debouncedFilter = React.useCallback(
      debounce((e: React.SyntheticEvent) => {
        const input = e.target as HTMLInputElement;
        setSearchText(input.value);
      }, 200),
      [setSearchText]
    );

    return (
      <>
        <div className={classes.header}>
          <div className={classes.buttonContainer}>
            <Button
              title="Information"
              tabIndex={0}
              className={classes.infoButton}
              onClick={() => setOpenDescription(!openDescription)}
            >
              <Info20Regular />
            </Button>
            {showClear ? null : <Button onClick={toggleRecording}
            disabled={!!showClear}>
              {isRecording ? "Stop" : "Record"}
            </Button>}
            <CopyButton
              hideCopy={isRecording || !showClear}
              operationsState={operationsState}
              apolloOperationsData={apollOperationsData}
            />
            {isRecording || !showClear ? null : (
              <Button
                style={{ marginLeft: "0.5rem" }}
                onClick={clearApolloOperations}
                disabled={!showClear}
              >
                Clear All
              </Button>
            )}
          </div>
          <div>
            <Search onSearchChange={debouncedFilter} />
          </div>
        </div>
        {openDescription && (
          <div className={classes.description}>
            It monitors changes in cache, fired mutations and
            activated/deactivated queries.
          </div>
        )}
      </>
    );
  }
);
