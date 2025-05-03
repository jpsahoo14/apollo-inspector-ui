import * as React from "react";
import { Collapse, Tooltip, Typography, Button } from "antd";
import { CopyOutlined, CloseOutlined } from "@ant-design/icons";
import {
  IVerboseOperation,
  IOperationResult,
  IVerboseOperationDuration,
  ResultsFrom,
} from "apollo-inspector";
import { useStyles, stylesKeys } from "./verbose-operation-view-styles";
import { OperationVariables, WatchQueryFetchPolicy } from "@apollo/client";
import {
  getOperationName,
  isNumber,
  sizeInBytes,
} from "../utils/apollo-operations-tracker-utils";
import { DocumentNode } from "graphql";
import copy from "copy-to-clipboard";
import { JsonViewer } from "view-json-react";

const { Text } = Typography;
const { Panel } = Collapse;
const spaceForStringify = 2;

interface IVerboseOperationViewProps {
  operation: IVerboseOperation | undefined | null;
  closeVerboseOperationView: () => void;
}

export const VerboseOperationView = (props: IVerboseOperationViewProps) => {
  const { operation, closeVerboseOperationView } = props;

  const classes = useStyles();

  const collapseItems = React.useMemo(() => {
    if (!operation) {
      return [];
    }

    return getCollapseItems(operation, classes);
  }, [operation, classes]);

  const closePreview = React.useCallback(() => {
    closeVerboseOperationView();
  }, [closeVerboseOperationView]);

  const copyOperation = React.useCallback(() => {
    const copyOperationData = JSON.stringify(operation);
    copy(copyOperationData);
  }, [operation]);

  if (!operation) {
    return null;
  }
  const { operationType, operationName } = operation;

  return (
    <div style={classes.operationView} key="verboseOperationView">
      <div style={classes.header} key="verboseHeader">
        <div style={classes.heading} key="operationType1">
          <div style={classes.operationNameText}> {operationName} </div>
          <div style={classes.operationType}> {operationType} </div>
        </div>
        <div style={classes.headerButtons}>
          <Tooltip title="Copy operation details">
            <Button
              key={`copy-btn`}
              onClick={copyOperation}
              style={classes.button}
              icon={<CopyOutlined style={classes.copyButtonIcon} />}
            />
          </Tooltip>
          <Tooltip title="Close operation view">
            <Button
              key={`dismiss-btn`}
              onClick={closePreview}
              style={classes.button}
              icon={<CloseOutlined style={classes.dismissButtonIcon} />}
            />
          </Tooltip>
        </div>
      </div>
      <div
        style={classes.accordionWrapper}
        key="operationnViewAccordionnWrapper"
      >
        <div style={classes.accordionPreWrapper}>
          <Collapse
            style={classes.operationDetails}
            key={"operationnViewAccordionn"}
            defaultActiveKey={['operationName']}
            ghost
          >
            {collapseItems}
          </Collapse>
        </div>
      </div>
    </div>
  );
};

const getCollapseItems = (
  operation: IVerboseOperation,
  classes: Record<stylesKeys, string>
) => {
  const {
    operationName,
    operationString,
    result,
    variables,
    isOptimistic,
    affectedQueries,
    duration,
    fetchPolicy,
    error,
    warning,
    clientId,
    affectedQueriesDueToOptimisticResponse,
  } = operation;
  const items: React.JSX.Element[] = [];

  items.push(getOperationNamePanel(operationName, operationString, classes));
  items.push(getVariablesPanel(variables, classes));
  clientId && items.push(getClientIdPanel(clientId, classes));
  fetchPolicy && items.push(getFetchPolicyPanel(fetchPolicy, classes));
  items.push(getDurationPanel(duration, classes));
  items.push(getResultPanel(isOptimistic, result, classes));
  error && items.push(getErrorPanel(error, classes));
  warning && items.push(getWarningPanel(warning, classes));
  items.push(
    getAffectedQueriesPanel(
      affectedQueries as DocumentNode[],
      classes,
      "affectedQueries",
      "Watch queries which are going to re-render due to the result of current operation",
      "Affected watch queries"
    )
  );
  affectedQueriesDueToOptimisticResponse &&
    affectedQueriesDueToOptimisticResponse.length > 0 &&
    items.push(
      getAffectedQueriesPanel(
        affectedQueriesDueToOptimisticResponse as DocumentNode[],
        classes,
        "affectedQueriesDueToOptimisticResponse",
        "Watch queries which are going to re-render due to the optimistic result of current operation",
        "Affected watch queries due to optimistic result"
      )
    );

  return items;
};

const getOperationNamePanel = (
  operationName: string | undefined,
  operationString: string,
  classes: Record<stylesKeys, string>
) => {
  return (
    <Panel 
      header={<Text style={{ fontFamily: "monospace" }}>{operationName}</Text>}
      key="operationName"
    >
      <div style={classes.operationNameAccPanel}>{operationString}</div>
    </Panel>
  );
};

const getVariablesPanel = (
  variables: OperationVariables | undefined,
  classes: Record<stylesKeys, string>
) => (
  <Panel
    header={<Tooltip title="Variables for the operation"><Text style={{ fontFamily: "monospace" }}>{"Variables"}</Text></Tooltip>}
    key="variables"
  >
    <div style={classes.operationVariablesAccPanel}>
      {JSON.stringify(variables, null, spaceForStringify)}
    </div>
  </Panel>
);

const getClientIdPanel = (
  clientId: string,
  classes: Record<stylesKeys, string>
) => (
  <Panel
    header={<Tooltip title="Apollo Client Id"><Text style={{ fontFamily: "monospace" }}>{`ClientId`}</Text></Tooltip>}
    key="clientId"
  >
    <div style={classes.accPanel}> {clientId}</div>
  </Panel>
);

const getFetchPolicyPanel = (
  fetchPolicy: WatchQueryFetchPolicy | undefined,
  classes: Record<stylesKeys, string>
) => (
  <Panel
    header={
      <Tooltip title="Fetch policy of the operation">
        <Text style={{ fontFamily: "monospace" }}>{`Fetch Policy ${
          fetchPolicy ? `(${fetchPolicy})` : ``
        }`}</Text>
      </Tooltip>
    }
    key="fetchPolicy"
  >
    <div style={classes.accPanel}> {fetchPolicy}</div>
  </Panel>
);

const getAffectedQueriesPanel = (
  affectedQueries: DocumentNode[],
  classes: Record<stylesKeys, string>,
  value: string,
  tooltipContent: string,
  accordionHeaderString: string
) => {
  const affectedQueriesItems = affectedQueries.map((item, index) => ({
    key: index,
    header: getOperationName(item),
  }));

  return (
    <Panel
      header={
        <Tooltip title={tooltipContent}>
          <Text style={{ fontFamily: "monospace" }}>
            {`${accordionHeaderString} (${affectedQueriesItems.length})`}
          </Text>
        </Tooltip>
      }
      key={value}
    >
      <div style={classes.affectedQueriesAccPanel}>
        {affectedQueriesItems.map((query, key) => (
          <div key={`affected-queries-${key}`}>{query.header}</div>
        ))}
      </div>
    </Panel>
  );
};

const getResultPanel = (
  isOptimistic: boolean | undefined,
  result: IOperationResult[],
  classes: Record<stylesKeys, string>
) => {
  const items = result.map((res: IOperationResult) => {
    const resultFrom = getResultFromString(res.from);

    return (
      <Panel
        header={
          <Text style={{ fontFamily: "monospace" }}>{`${resultFrom} ${
            res.size ? `(${sizeInBytes(res.size)})` : ``
          }`}</Text>
        }
        key={resultFrom}
      >
        <div style={classes.resultPanel}>
          <JsonViewer
            data={res.result}
            expandLevel={1}
            style={{ color: "#1890ff" }}
          />
        </div>
      </Panel>
    );
  });

  return (
    <Panel
      header={
        <Tooltip title="Data/result of the operation, whether its from cache or network">
          <Text style={{ fontFamily: "monospace" }}>{`Result ${
            isOptimistic ? "(Optimistic result)" : ""
          }`}</Text>
        </Tooltip>
      }
      key="result"
    >
      <Collapse ghost>{items}</Collapse>
    </Panel>
  );
};

const getResultFromString = (from: ResultsFrom) => {
  switch (from) {
    case ResultsFrom.CACHE: {
      return "CACHE";
    }
    case ResultsFrom.NETWORK: {
      return "NETWORK";
    }
    case ResultsFrom.OPTIMISTIC_RESPONSE: {
      return "OPTIMISTIC_RESPONSE";
    }
  }
  return "Unknown";
};

const getErrorPanel = (error: unknown, classes: Record<stylesKeys, string>) => (
  <Panel
    header={
      <Tooltip title="Error message for operation failure">
        <Text style={{ fontFamily: "monospace" }}>{`Error ${
          error ? "(failed)" : ""
        }`}</Text>
      </Tooltip>
    }
    key="errorPanel"
  >
    <div style={classes.accPanel}> {JSON.stringify(error)}</div>
  </Panel>
);

const getWarningPanel = (
  warning: unknown[],
  classes: Record<stylesKeys, string>
) => (
  <Panel
    header={
      <Tooltip title="Show any warning like missing field error or why the result is not fetched from cache">
        <Text style={{ fontFamily: "monospace" }}>{`Warning`}</Text>
      </Tooltip>
    }
    key="warningPanel"
  >
    <div style={classes.accPanel}> {JSON.stringify(warning)}</div>
  </Panel>
);

const getDurationPanel = (
  duration: IVerboseOperationDuration | undefined,
  classes: Record<stylesKeys, string>
) => (
  <Panel
    header={
      <Tooltip title="Detailed time info for operation in milliSeconds">
        <Text style={{ fontFamily: "monospace" }}>{`Duration ${
          duration?.totalTime ? `(${duration.totalTime} ms)` : `(ms)`
        }`}</Text>
      </Tooltip>
    }
    key="duration"
  >
    <div style={classes.durationAccPanel}>
      <Text key="1">{`Total execution time: ${duration?.totalTime}`}</Text>
      {isNumber(duration?.requestExecutionTime) ? (
        <Text key="2">{`Time spend to get the data from resolver: ${duration?.requestExecutionTime}`}</Text>
      ) : (
        <div />
      )}
      {isNumber(duration?.cacheWriteTime) ? (
        <Text key="3">{`Time spent to write data to cache: ${duration?.cacheWriteTime}`}</Text>
      ) : (
        <div />
      )}
      {isNumber(duration?.cacheDiffTime) ? (
        <Text key="4">{`Time spent to diff data from cache: ${duration?.cacheDiffTime}`}</Text>
      ) : (
        <div />
      )}
      {isNumber(duration?.cacheBroadcastWatchesTime) ? (
        <Text key="5">{`Time spent to broadcastWatches: ${duration?.cacheBroadcastWatchesTime}`}</Text>
      ) : (
        <div />
      )}
    </div>
  </Panel>
);
