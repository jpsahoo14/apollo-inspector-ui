import * as React from "react";
import { Checkbox } from "@fluentui/react-components";
import { OperationType, ResultsFrom } from "apollo-inspector";
import { useStyles } from "./filter-view.styles";

interface IFilterView {
  setFilters: (filterSet: IFilterSet | null) => void;
  filters: IFilterSet
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
  filters: IFilterSet| null;
  setFilters: (filterSet: IFilterSet | null) => void;
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
  const [querySubTypesChecked, setQuerySubTypesChecked] = React.useState([]);
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
    setFilters,
    operationTypesFilter,
    statusFilter
  );
  const onStatusChange = useOnStatusChange(
    statusFilter,
    setStatusFilter,
    setFilters,
    resultFromFilter,
    operationTypesFilter
  );

  const statues = Object.entries(OperationStatus)
    .filter((status) => status[0] !== OperationStatus.InFlight)
    .map((value, key) => {
      const checkboxValue = (value as unknown as Array<string>)[0];
      return (
        <Checkbox
          onChange={onStatusChange}
          value={checkboxValue}
          label={checkboxValue}
          key={key}
        />
      );
    });

  const resultsFrom = Object.entries(ResultsFrom).map((value, key) => {
    const checkboxValue = (value as unknown as Array<string>)[0];
    return (
      <Checkbox
        onChange={onResultChange}
        value={checkboxValue}
        label={checkboxValue}
        key={key}
      />
    );
  });
  return (
    <div className={classes.filterView}>
      <div>
        <div className={classes.filters}>
          <h3 key="operationType">{`Filters`}&nbsp;</h3>
        </div>
      </div>
      <div className={classes.type}>
        <div>
          <h5 key="operationType">{`Type`}&nbsp;</h5>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {operationTypes}
        </div>
      </div>
      <div className={classes.operationType}>
        <div>
          <h5 key="operationType">{`Result from`}&nbsp;</h5>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {resultsFrom}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <h5 key="operationType">{`Status`}&nbsp;</h5>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {statues}
        </div>
      </div>
    </div>
  );
});

const useOperationTypesCheckBox = ({
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
}: IUseOperationTypesCheckBoxParams) => {
  const onOperationTypeChange = React.useCallback(
    ({ target: { value } }, { checked }) => {
      let typesFilter = operationTypesFilter.concat([]);
      // if (value == "Query") {
      //   setQueryChecked(checked);
      //   console.log({ checked, querySubTypes });
      //   setQuerySubTypesChecked(checked ? querySubTypes : []);
      //   //console.log({ checked, querySubTypes, querySubTypesChecked });
      // }
      if (checked) {
        !typesFilter.includes(value) && typesFilter.push(value);
        if (value == OperationType.Query) {
          querySubTypes.forEach((type) => {
            typesFilter.push(type);
          });

          fragmentSubTypes.forEach((type) => {
            typesFilter.push(type);
          });
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
      // setTimeout(() => {
      //   setFilters((prevState: IFilterSet) => {
      //     console.log({
      //       operationtype: "type",
      //       prevState,
      //       typesFilter,
      //     });
      //     return {
      //       ...prevState,
      //       types: typesFilter,
      //     };
      //   });
      // }, 0);
      setFilters((prevState: IFilterSet) => {
        console.log({
          operationtype: "type",
          prevState,
          typesFilter,
        });
        return {
          ...prevState,
          types: typesFilter,
        };
      });
    },
    [operationTypesFilter, setOperationTypesFilter, setFilters]
  );

  const onSubTypeChange = useOnSubTypeChange(
    statusFilter,
    setOperationTypesFilter,
    filters,
    setFilters,
    resultFromFilter,
    operationTypesFilter,
    queryChecked,
    setQueryChecked,
    querySubTypesChecked,
    setQuerySubTypesChecked
  );

  const operationTypes = React.useMemo(() => {
    console.log({ querySubTypesChecked });
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
      .map((value, key) => {
        const checkboxValue = (value as unknown as Array<string>)[0];
        return (
          <>
            <Checkbox
              onChange={onOperationTypeChange}
              value={checkboxValue}
              label={checkboxValue}
              checked={filters?.types.includes(checkboxValue)}
              key={key}
            />
            {checkboxValue.includes("Query") && (
              <div style={{ marginLeft: "20px", display: "Flex", flexDirection: "column" }}>
                {Object.entries(OperationType)
                  .filter((value) =>
                    querySubTypes.includes(
                      (value as unknown as Array<string>)[0] as OperationType
                    ) || fragmentSubTypes.includes(
                      (value as unknown as Array<string>)[0] as OperationType
                    ) 
                  )
                  .map(([key, value]) => (
                    <Checkbox
                      key={key}
                      label={value}
                      value={value}
                      checked={filters?.types.includes(value)}
                      onChange={onSubTypeChange}
                    />
                  ))}
              </div>
            )}
          </>
        );
      });
  }, [onOperationTypeChange]);

  return operationTypes;
};

const useOnSubTypeChange = (
  statusFilter: string[],
  setOperationTypesFilter: React.Dispatch<React.SetStateAction<string[]>>,
  filters: IFilterSet | null,
  setFilters: (filterSet: IFilterSet | null) => void,
  resultFromFilter: string[],
  operationTypesFilter: string[],
  queryChecked,
  setQueryChecked,
  querySubTypesChecked,
  setQuerySubTypesChecked
) =>
  React.useCallback(
    ({ target: { value } }, { checked }) => {
      let arr = operationTypesFilter.concat([]);
      // const updatedChildChecked = checked
      //   ? [...querySubTypesChecked, value]
      //   : querySubTypesChecked.filter((item) => item !== value);

      // setQuerySubTypesChecked(updatedChildChecked);
      // console.log({ updatedChildChecked, value });
      // setQueryChecked(updatedChildChecked.length === 4);
      if (checked) {
        !arr.includes(value) && arr.push(value);
        (arr.length == 8) && (!arr.includes('Query')) && arr.push('Query');
          
      } else {
        arr = arr.filter((x) => x !== value);
        if((arr.length == 1) && (arr.includes('Query')))
          arr = arr.filter(y => y !== 'Query');
      }
      setOperationTypesFilter(arr);
      // setTimeout(() => {
      //   setFilters((prevState: IFilterSet) => {
      //     console.log({
      //       operationtype: "subtype",
      //       prevState,
      //       arr,
      //     });
      //     return {
      //       ...prevState,
      //       types: arr,
      //     };
      //   });
      // }, 0);
      setFilters((prevState: IFilterSet) => {
        console.log({
          operationtype: "subtype",
          prevState,
          arr,
        });
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
  setFilters: (filterSet: IFilterSet | null) => void,
  resultFromFilter: string[],
  operationTypesFilter: string[]
) =>
  React.useCallback(
    ({ target: { value } }, { checked }) => {
      let arr = statusFilter.concat([]);
      if (checked) {
        arr.push(value);
      } else {
        arr = arr.filter((x) => x !== value);
      }
      setStatusFilter(arr);
      // setTimeout(() => {
      //   setFilters((prevState: IFilterSet) => {
      //     console.log({
      //       operationtype: "status",
      //       prevState,
      //       arr,
      //     });
      //     return {
      //       ...prevState,
      //       statuses: arr,
      //     };
      //   });
      // }, 0);
      setFilters((prevState: IFilterSet) => {
        console.log({
          operationtype: "status",
          prevState,
          arr,
        });
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
  setFilters: (filterSet: IFilterSet | null) => void,
  operationTypesFilter: string[],
  statusFilter: string[]
) =>
  React.useCallback(
    ({ target: { value } }, { checked }) => {
      let arr = resultFromFilter.concat([]);
      if (checked) {
        arr.push(value);
      } else {
        arr = arr.filter((x) => x !== value);
      }
      setResultFromFilter(arr);
      // setTimeout(() => {
      //   setFilters((prevState: IFilterSet) => {
      //     console.log({
      //       operationtype: "result",
      //       prevState,
      //       arr,
      //     });
      //     if (prevState != null) {
      //       return {
      //         ...prevState,
      //         results: arr,
      //       };
      //     }
      //     return null;
      //   });
      // }, 0);
      setFilters((prevState: IFilterSet) => {
        console.log({
          operationtype: "result",
          prevState,
          arr,
        });
        if (prevState != null) {
          return {
            ...prevState,
            results: arr,
          };
        }
        return null;
      });
    },
    [resultFromFilter, setResultFromFilter]
  );
