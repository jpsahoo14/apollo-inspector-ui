import * as React from "react";
import { Checkbox, CheckboxOnChangeData } from "@fluentui/react-components";
import { OperationType, ResultsFrom } from "apollo-inspector";
import { useStyles } from "./filter-view.styles";
import { IOperationsReducerState } from "../operations-tracker-container-helper";

interface IFilterView {
  setFilters: (input: React.SetStateAction<IFilterSet>) => void;
  filters: IFilterSet;
  operationsState: IOperationsReducerState;
}

export enum OperationStatus {
  InFlight = "InFlight",
  Succeded = "Succeded",
  Failed = "Failed",
  PartialSuccess = "PartialSuccess",
  Unknown = "Unknown",
}

export interface IFilterSet {
  results: string[];
  types: string[];
  statuses: string[];
}

export const querySubTypes = [
  OperationType.CacheReadQuery,
  OperationType.CacheWriteQuery,
  OperationType.ClientReadQuery,
  OperationType.ClientWriteQuery,
];

export const fragmentSubTypes = [
  OperationType.CacheReadFragment,
  OperationType.CacheWriteFragment,
  OperationType.ClientReadFragment,
  OperationType.ClientWriteFragment,
];

interface IUseOperationTypesCheckBoxParams {
  operationTypesFilter: string[];
  setOperationTypesFilter: React.Dispatch<React.SetStateAction<string[]>>;
  filters: IFilterSet | null;
  setFilters: (input: React.SetStateAction<IFilterSet>) => void;
  resultFromFilter: string[];
  statusFilter: string[];
  queryChecked: boolean;
  setQueryChecked: React.Dispatch<React.SetStateAction<boolean>>;
  querySubTypesChecked: OperationType[];
  setQuerySubTypesChecked: React.Dispatch<
    React.SetStateAction<OperationType[]>
  >;
}

export const FilterView = React.memo((props: IFilterView) => {
  const [operationTypesFilter, setOperationTypesFilter] = React.useState<
    string[]
  >([]);
  const [resultFromFilter, setResultFromFilter] = React.useState<string[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const { setFilters, filters } = props;
  const [queryChecked, setQueryChecked] = React.useState(false);
  const [querySubTypesChecked, setQuerySubTypesChecked] = React.useState<
    OperationType[]
  >([]);
  const classes = useStyles();

  const operationTypes = useOperationTypesCheckBox({
    operationTypesFilter,
    setOperationTypesFilter,
    filters,
    setFilters,
    resultFromFilter,
    statusFilter,
    queryChecked,
    setQueryChecked,
    querySubTypesChecked,
    setQuerySubTypesChecked,
  });

  const onResultChange = useOnResultChange(
    resultFromFilter,
    setResultFromFilter,
    setFilters
  );
  const onStatusChange = useOnStatusChange(
    statusFilter,
    setStatusFilter,
    setFilters
  );

  const statues = Object.entries(OperationStatus)
    .filter((status) => status[0] !== OperationStatus.InFlight)
    .map((value) => {
      const checkboxValue = (value as unknown as Array<string>)[0];
      return (
        <Checkbox
          onChange={onStatusChange}
          value={checkboxValue}
          label={checkboxValue}
          key={`status-${checkboxValue}`}
        />
      );
    });

  const resultsFrom = Object.entries(ResultsFrom).map((value) => {
    const checkboxValue = (value as unknown as Array<string>)[0];
    return (
      <Checkbox
        onChange={onResultChange}
        value={checkboxValue}
        label={checkboxValue}
        key={`result-${checkboxValue}`}
      />
    );
  });

  return (
    <div className={classes.filterView}>
      {renderOperationTypeFilter(classes, operationTypes)}
      {renderResultsFromFiter(classes, resultsFrom)}
      {renderOperationStatusFilter(statues)}
    </div>
  );
});

const useOperationTypesCheckBox = ({
  operationTypesFilter,
  setOperationTypesFilter,
  setFilters,
}: IUseOperationTypesCheckBoxParams) => {
  const onOperationTypeChange = useOnOperationTypeFilterChange(
    operationTypesFilter,
    setOperationTypesFilter,
    setFilters
  );

  const onSubTypeChange = useOnSubTypeChange({
    operationTypesFilter,
    setFilters,
    setOperationTypesFilter,
  });

  const operationTypes = React.useMemo(() => {
    return Object.entries(OperationType)
      .filter(
        (value) =>
          !querySubTypes.includes(
            (value as unknown as Array<string>)[0] as OperationType
          )
      )
      .filter(
        (value) =>
          !fragmentSubTypes.includes(
            (value as unknown as Array<string>)[0] as OperationType
          )
      )
      .map((value) => {
        const checkboxValue = (value as unknown as Array<string>)[0];
        return (
          <>
            <Checkbox
              onChange={onOperationTypeChange}
              value={checkboxValue}
              label={checkboxValue}
              checked={!!operationTypesFilter?.includes(checkboxValue)}
              key={`type-${checkboxValue}`}
            />
            {checkboxValue.includes("Query") && (
              <div
                key="query-subvalues"
                style={{
                  marginLeft: "2rem",
                  display: "Flex",
                  flexDirection: "column",
                }}
              >
                {Object.entries(OperationType)
                  .filter((value) => {
                    return (
                      querySubTypes.includes(
                        (value as unknown as Array<string>)[0] as OperationType
                      ) ||
                      fragmentSubTypes.includes(
                        (value as unknown as Array<string>)[0] as OperationType
                      ) ||
                      value[0] === OperationType.Query
                    );
                  })
                  .map(([key, value]) => {
                    console.log({ value, key, Query: "query" });

                    return (
                      <Checkbox
                        key={key}
                        label={value}
                        value={value}
                        checked={!!operationTypesFilter?.includes(value)}
                        onChange={onSubTypeChange}
                      />
                    );
                  })}
              </div>
            )}
          </>
        );
      });
  }, [onOperationTypeChange, onSubTypeChange, operationTypesFilter]);

  return operationTypes;
};

interface IUseOnSubTypeChange {
  operationTypesFilter: string[];
  setFilters: (input: React.SetStateAction<IFilterSet>) => void;
  setOperationTypesFilter: React.Dispatch<React.SetStateAction<string[]>>;
}

const useOnSubTypeChange = ({
  operationTypesFilter,
  setFilters,
  setOperationTypesFilter,
}: IUseOnSubTypeChange) =>
  React.useCallback(
    (
      { target: { value } }: React.ChangeEvent<HTMLInputElement>,
      { checked }: CheckboxOnChangeData
    ) => {
      let arr = operationTypesFilter.concat([]);

      if (checked) {
        !arr.includes(value) && arr.push(value);
        arr.length == 9 && !arr.includes("Query") && arr.push("Query");
      } else {
        arr = arr.filter((x) => x !== value);
        if (arr.length == 1 && arr.includes("Query"))
          arr = arr.filter((y) => y !== "Query");
      }
      setOperationTypesFilter(arr);

      setFilters((prevState: IFilterSet) => {
        return {
          ...prevState,
          types: arr,
        };
      });
    },
    [operationTypesFilter, setOperationTypesFilter]
  );

const useOnStatusChange = (
  statusFilter: string[],
  setStatusFilter: React.Dispatch<React.SetStateAction<string[]>>,
  setFilters: (input: React.SetStateAction<IFilterSet>) => void
) =>
  React.useCallback(
    (
      { target: { value } }: React.ChangeEvent<HTMLInputElement>,
      { checked }: CheckboxOnChangeData
    ) => {
      let arr = statusFilter.concat([]);
      if (checked) {
        arr.push(value);
      } else {
        arr = arr.filter((x) => x !== value);
      }
      setStatusFilter(arr);

      setFilters((prevState: IFilterSet) => {
        return {
          ...prevState,
          statuses: arr,
        };
      });
    },
    [statusFilter, setStatusFilter]
  );

const useOnResultChange = (
  resultFromFilter: string[],
  setResultFromFilter: React.Dispatch<React.SetStateAction<string[]>>,
  setFilters: (input: React.SetStateAction<IFilterSet>) => void
) =>
  React.useCallback(
    (
      { target: { value } }: React.ChangeEvent<HTMLInputElement>,
      { checked }: CheckboxOnChangeData
    ) => {
      let arr = resultFromFilter.concat([]);
      if (checked) {
        arr.push(value);
      } else {
        arr = arr.filter((x) => x !== value);
      }
      setResultFromFilter(arr);
      setFilters((prevState: IFilterSet) => {
        return {
          ...prevState,
          results: arr,
        };
      });
    },
    [resultFromFilter, setResultFromFilter]
  );

const useOnOperationTypeFilterChange = (
  operationTypesFilter: string[],
  setOperationTypesFilter: React.Dispatch<React.SetStateAction<string[]>>,
  setFilters: (input: React.SetStateAction<IFilterSet>) => void
) =>
  React.useCallback(
    (
      { target: { value } }: React.ChangeEvent<HTMLInputElement>,
      { checked }: CheckboxOnChangeData
    ) => {
      let typesFilter = operationTypesFilter.concat([]);
      if (checked) {
        !typesFilter.includes(value) && typesFilter.push(value);
        if (value === OperationType.Query) {
          querySubTypes.forEach((type) => {
            typesFilter.push(type);
          });

          fragmentSubTypes.forEach((type) => {
            typesFilter.push(type);
          });
          typesFilter.push(OperationType.Query);
        }
      } else {
        typesFilter = typesFilter.filter((x) => x !== value);

        if (value == OperationType.Query) {
          typesFilter = typesFilter.filter((x) => {
            if (x === value) {
              return x === value;
            }
            if (querySubTypes.find((type) => type === x)) {
              return false;
            }

            if (fragmentSubTypes.find((type) => type === x)) {
              return false;
            }

            return true;
          });
        }
      }
      setOperationTypesFilter(typesFilter);

      setFilters((prevState: IFilterSet) => {
        return {
          ...prevState,
          types: typesFilter,
        };
      });
    },
    [operationTypesFilter, setOperationTypesFilter, setFilters]
  );

const renderResultsFromFiter = (
  classes: Record<"filters" | "filterView" | "type" | "operationType", string>,
  resultsFrom: React.JSX.Element[]
) => (
  <div key="results-from-filter" className={classes.operationType}>
    <div key="results-from-header">
      <h5 key="operationType">{`Result from`}&nbsp;</h5>
    </div>
    <div
      key="results-from-values"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {resultsFrom}
    </div>
  </div>
);

const renderOperationStatusFilter = (statues: React.JSX.Element[]) => (
  <div key="status-filter" style={{ display: "flex", flexDirection: "column" }}>
    <div key="status-header">
      <h5 key="status">{`Status`}&nbsp;</h5>
    </div>
    <div
      key="status-values"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {statues}
    </div>
  </div>
);

const renderOperationTypeFilter = (
  classes: Record<
    "operationType" | "type" | "typeText" | "filters" | "filterView",
    string
  >,
  operationTypes: React.JSX.Element[]
) => (
  <div key="operation-type-filter" className={classes.type}>
    <div key="type-header" className={classes.typeText}>
      Type
    </div>
    <div key="type-values" style={{ display: "flex", flexDirection: "column" }}>
      {operationTypes}
    </div>
  </div>
);

FilterView.displayName = "FilterView";
