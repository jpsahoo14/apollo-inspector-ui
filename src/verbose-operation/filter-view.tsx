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
  const { setFilters, filters } = props;
  const [operationTypesFilter, setOperationTypesFilter] = React.useState<
    string[]
  >(filters?.types || []);
  const [resultFromFilter, setResultFromFilter] = React.useState<string[]>(
    filters?.results || []
  );
  const [statusFilter, setStatusFilter] = React.useState<string[]>(
    filters?.statuses || []
  );
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
    filters,
    setFilters
  );
  const onStatusChange = useOnStatusChange(
    statusFilter,
    setStatusFilter,
    filters,
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
          defaultChecked={!!statusFilter.includes(checkboxValue)}
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
        defaultChecked={!!resultFromFilter.includes(checkboxValue)}
      />
    );
  });

  console.log({
    filters,
    operationTypesFilter,
    resultFromFilter,
    statusFilter,
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
  filters,
  setFilters,
}: IUseOperationTypesCheckBoxParams) => {
  const onOperationTypeChange = useOnOperationTypeFilterChange(
    operationTypesFilter,
    setOperationTypesFilter,
    filters,
    setFilters
  );

  const onSubTypeChange = useOnSubTypeChange({
    operationTypesFilter,
    setOperationTypesFilter,
    filters,
    setFilters,
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
          <React.Fragment key={`type-${checkboxValue}`}>
            <Checkbox
              onChange={onOperationTypeChange}
              value={checkboxValue}
              label={checkboxValue}
              checked={!!operationTypesFilter?.includes(checkboxValue)}
              key={`type-${checkboxValue}`}
              defaultChecked={!!operationTypesFilter.includes(checkboxValue)}
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
                    return (
                      <Checkbox
                        key={key}
                        label={value}
                        value={value}
                        checked={!!operationTypesFilter?.includes(value)}
                        onChange={onSubTypeChange}
                        defaultChecked={!!operationTypesFilter.includes(value)}
                      />
                    );
                  })}
              </div>
            )}
          </React.Fragment>
        );
      });
  }, [onOperationTypeChange, onSubTypeChange, operationTypesFilter, filters]);

  return operationTypes;
};

interface IUseOnSubTypeChange {
  operationTypesFilter: string[];
  setOperationTypesFilter: React.Dispatch<React.SetStateAction<string[]>>;
  filters: IFilterSet | null;
  setFilters: (input: React.SetStateAction<IFilterSet>) => void;
}

const useOnSubTypeChange = ({
  operationTypesFilter,
  setOperationTypesFilter,
  filters,
  setFilters,
}: IUseOnSubTypeChange) =>
  React.useCallback(
    (
      { target: { value } }: React.ChangeEvent<HTMLInputElement>,
      { checked }: CheckboxOnChangeData
    ) => {
      let arr = Array.from(
        new Set([...operationTypesFilter, ...(filters?.types || [])])
      );

      if (checked && !arr.includes(value)) {
        arr.push(value);
      } else if (!checked) {
        arr = arr.filter((x) => x !== value);
      }
      setOperationTypesFilter(arr);

      setFilters((prevState: IFilterSet) => {
        return {
          ...prevState,
          types: arr,
        };
      });
      console.error({ arr, filters });
    },
    [operationTypesFilter, setOperationTypesFilter, filters, setFilters]
  );

const useOnStatusChange = (
  statusFilter: string[],
  setStatusFilter: React.Dispatch<React.SetStateAction<string[]>>,
  filters: IFilterSet,
  setFilters: (input: React.SetStateAction<IFilterSet>) => void
) =>
  React.useCallback(
    (
      { target: { value } }: React.ChangeEvent<HTMLInputElement>,
      { checked }: CheckboxOnChangeData
    ) => {
      let arr = Array.from(new Set([...statusFilter, ...filters.statuses]));
      if (checked && arr.indexOf(value) === -1) {
        arr.push(value);
      } else if (!checked) {
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
    [statusFilter, setStatusFilter, filters, setFilters]
  );

const useOnResultChange = (
  resultFromFilter: string[],
  setResultFromFilter: React.Dispatch<React.SetStateAction<string[]>>,
  filters: IFilterSet,
  setFilters: (input: React.SetStateAction<IFilterSet>) => void
) =>
  React.useCallback(
    (
      { target: { value } }: React.ChangeEvent<HTMLInputElement>,
      { checked }: CheckboxOnChangeData
    ) => {
      let arr = Array.from(new Set([...resultFromFilter, ...filters.results]));
      if (checked && arr.indexOf(value) === -1) {
        arr.push(value);
      } else if (!checked) {
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
    [resultFromFilter, setResultFromFilter, filters, setFilters]
  );

const useOnOperationTypeFilterChange = (
  operationTypesFilter: string[],
  setOperationTypesFilter: React.Dispatch<React.SetStateAction<string[]>>,
  filters: IFilterSet | null,
  setFilters: (input: React.SetStateAction<IFilterSet>) => void
) =>
  React.useCallback(
    (
      { target: { value } }: React.ChangeEvent<HTMLInputElement>,
      { checked }: CheckboxOnChangeData
    ) => {
      let typesFilter = Array.from(
        new Set([...operationTypesFilter, ...(filters?.types || [])])
      );
      console.log({ operationTypesFilter, filters, typesFilter });
      if (checked && !typesFilter.includes(value)) {
        typesFilter.push(value);
        if (value === OperationType.Query) {
          querySubTypes.forEach((type) => {
            !typesFilter.includes(type) && typesFilter.push(type);
          });

          fragmentSubTypes.forEach((type) => {
            !typesFilter.includes(type) && typesFilter.push(type);
          });
        }
      } else if (!checked) {
        typesFilter = typesFilter.filter((x) => x !== value);

        if (value == OperationType.Query) {
          typesFilter = typesFilter.filter((x) => {
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
      console.log({ typesFilter, filters });
    },
    [operationTypesFilter, setOperationTypesFilter, setFilters, filters]
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
